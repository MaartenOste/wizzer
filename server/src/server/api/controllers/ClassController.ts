import { NextFunction, Response } from 'express';
import { Class, CompletedExercise, ICompletedExercise } from '../../models/mongoose';
import { Request } from './CustomRequest';
import { NotFoundError } from '../../utilities';
import { default as mongoose} from 'mongoose';

class ClassController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let classGroups = await Class.find()
        .populate('teacher')
        .populate('students')
        .populate('exercises')
        .sort({ name: -1 })
        .exec();
      return res.status(200).json(classGroups);
    } catch (err) {
      next(err);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const classGroup = await Class.findById(id)
        .populate('teacher')
        .populate('students')
        .populate('exercises')
        .exec();
      return res.status(200).json(classGroup);
    } catch (err) {
      next(err);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const { id } = req.params;

    try {
      const classUpdate = {
        _id: id,
        name: req.body.name,
        _exercises: req.body._exercises,
        _modifiedAt: new Date().getTime(),
        _studentIds: req.body._studentIds,
        _teacherId: req.body._teacherId,
        slug: req.body.slug,
      };

      const classGroup = await Class.findOneAndUpdate(
        { _id: id },
        classUpdate,
        {
          new: true,
        },
      ).populate('teacher')
      .populate('students')
      .populate('exercises')
      .exec();

      if (!classGroup) {
        throw new NotFoundError();
      }
      return res.status(200).json(classGroup);
    } catch (err) {
      next(err);
    }
  };

  getClassByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const { id } = req.params;

    try {
      const classGroup = await Class.findOne({
        $or: [{ _studentIds: id }, { _teacherId: id }],
      })
        .populate('teacher')
        .populate('students')
        .populate('exercises')
        .exec();

      if (!classGroup) {
        throw new NotFoundError();
      }

      return res.status(200).json(classGroup);
    } catch (err) {
      next(err);
    }
  };

  joinClass = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const { id, userId } = req.params;

    try {
      const classGroup = await Class.findOne({ _id: id }).exec();

      if (!classGroup) {
        throw new NotFoundError();
      }

      if (!classGroup._studentIds.includes(userId)) {
        classGroup._studentIds.push(userId);
        classGroup.save();
        return res.status(200).json(classGroup);
      } else {
        throw new Error('User already in class');
      }
    } catch (err) {
      next(err);
    }
  };

  deleteExercise = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const { exerciseId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();
    const initialClass = await Class.findOne({ _teacherId: req.body.userId })
    .exec()

    try {
      const classGroup = await Class.updateOne(
        { _teacherId: req.body.userId },
        { $pull: {_exercises: {_exerciseGroupId: exerciseId}}},
        {session: session}
      )
      .populate('teacher')
      .populate('students')
      .populate('exercises')

      if (!classGroup.ok) {
        throw new NotFoundError();
      }

      const deletetExercises = await CompletedExercise.deleteMany({
        $and: [{ _classId:  initialClass._id }, { _exerciseId: exerciseId }],
      }).session(session);


      if (!deletetExercises.ok) {
        throw new Error('Deleting completedExercises failed');
      }
      await session.commitTransaction();


      const response = await Class.findOne({ _teacherId: req.body.userId })
      .populate('teacher')
      .populate('students')
      .populate('exercises')
      .exec()

      session.endSession();

      return res.status(200).json(response);
    } catch (err) {
      await session.abortTransaction();
      next(err);
    }
  };

  addExercise = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {

    const { exerciseId } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    const data = {_exerciseGroupId: exerciseId, public: false, _addedAt: Date.now()};
    const initialClass = await Class.findOne({ _teacherId: req.body.userId })
    .exec()

    try {
      const classGroup = await Class.updateOne(
        { _teacherId: req.body.userId },
        { $push: {_exercises: data} },
        { session: session, new: true }
        )
      .populate('teacher')
      .populate('students')
      .populate('exercises')
      .exec()
      

      if (!classGroup.ok) {
        throw new NotFoundError();
      }
      
      let exercises:Array<ICompletedExercise> = []

      initialClass._studentIds.forEach((student:any)=>{
        const classDetail = {
          score: 'Nog niet ingediend',
          answers: [{
            answerData: { data: '' },
            correct: false,
          }],
          _completedBy: student,
          _classId: initialClass._id,
          _exerciseId: exerciseId,
        };
        const completedExercise: ICompletedExercise = new CompletedExercise(
          classDetail,
        );
        exercises.push(completedExercise)
      })

      const addedExercises = await CompletedExercise.insertMany(
        exercises
      , { session: session })

      if (!addedExercises) {
        throw new Error('Adding completedExercises failed');
      }

      await session.commitTransaction();

      const response = await Class.findOne({ _teacherId: req.body.userId })
      .populate('teacher')
      .populate('students')
      .populate('exercises')
      .exec()

      session.endSession();
      return res.status(200).json(response);
    } catch (err) {
      await session.abortTransaction();
      next(err);
    }
  };
}

export default ClassController;
