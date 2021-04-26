import { NextFunction, Response } from 'express';
import {
  Class,
  CompletedExercise,
  ICompletedExercise,
} from '../../models/mongoose';
import { Request } from './CustomRequest';
import { NotFoundError } from '../../utilities';
import { default as mongoose } from 'mongoose';
import CompletedExerciseController from './CompletedExerciseController';

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

  getTopThree = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { classId } = req.params;

      let temp = await CompletedExercise.find({
        _classId: classId,
      })
        .populate('exercise')
        .populate('completedBy')
        .exec();

      let result: any = {};
      temp.forEach((el:ICompletedExercise) => {
        console.log(el);
        
        if (el.score !== 'Nog niet ingediend') {
          if (
            result[`${el.completedBy.firstname} ${el.completedBy.lastname}`]
          ) {
            result[
              `${el.completedBy.firstname} ${el.completedBy.lastname}`
            ] += parseInt(el.score.split('/')[0]);
          } else {
            result[
              `${el.completedBy.firstname} ${el.completedBy.lastname}`
            ] = parseInt(el.score.split('/')[0]);
          }
        }
      });

      let sortable: any = [];
      for (let el in result) {
        sortable.push([el, result[el]]);
      }

      sortable.sort((a: any, b: any) => {
        return b[1] - a[1];
      });

      return res.status(200).json(sortable.slice(0, 3));
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
      )
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

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const classGroup = new Class({
        name: req.body.name,
        _exercises: [],
        _studentIds: [],
        _teacherId: req.body._teacherId,
      });

      classGroup.save(err => {
        throw new Error('Class creation failed');
      });

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
      if (id === 'undefined' || id === undefined) {
        throw new Error('id is undefined');
      }
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

        let exercises: Array<ICompletedExercise> = [];

        classGroup._exercises.forEach((exercise: any) => {
          const exerciseDetail = {
            score: 'Nog niet ingediend',
            answers: [
              {
                answerData: { data: '' },
                correct: false,
              },
            ],
            _completedBy: userId,
            _classId: classGroup._id,
            _exerciseId: exercise._exerciseGroupId,
          };

          const completedExercise: ICompletedExercise = new CompletedExercise(
            exerciseDetail,
          );
          exercises.push(completedExercise);
        });

        await CompletedExercise.insertMany(exercises);
        
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
    const initialClass = await Class.findOne({
      _teacherId: req.body.userId,
    }).exec();

    try {
      const classGroup = await Class.updateOne(
        { _teacherId: req.body.userId },
        { $pull: { _exercises: { _exerciseGroupId: exerciseId } } },
        { session: session },
      )
        .populate('teacher')
        .populate('students')
        .populate('exercises');

      if (!classGroup.ok) {
        throw new NotFoundError();
      }

      const deletetExercises = await CompletedExercise.deleteMany({
        $and: [{ _classId: initialClass._id }, { _exerciseId: exerciseId }],
      }).session(session);

      if (!deletetExercises.ok) {
        throw new Error('Deleting completedExercises failed');
      }
      await session.commitTransaction();

      const response = await Class.findOne({ _teacherId: req.body.userId })
        .populate('teacher')
        .populate('students')
        .populate('exercises')
        .exec();

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

    const data = {
      _exerciseGroupId: exerciseId,
      public: false,
      _addedAt: Date.now(),
      dueDate: req.body.dueDate || new Date().toISOString().slice(0, 10),
    };
    const initialClass = await Class.findOne({
      _teacherId: req.session.passport.user.id,
    }).exec();

    try {
      const classGroup = await Class.updateOne(
        { _teacherId: req.session.passport.user.id },
        { $push: { _exercises: data } },
        { session: session, new: true },
      )
        .populate('teacher')
        .populate('students')
        .populate('exercises')
        .exec();

      if (!classGroup.ok) {
        throw new NotFoundError();
      }

      let exercises: Array<ICompletedExercise> = [];

      initialClass._studentIds.forEach((student: any) => {
        const classDetail = {
          score: 'Nog niet ingediend',
          answers: [
            {
              answerData: { data: '' },
              correct: false,
            },
          ],
          _completedBy: student,
          _classId: initialClass._id,
          _exerciseId: exerciseId,
        };
        const completedExercise: ICompletedExercise = new CompletedExercise(
          classDetail,
        );
        exercises.push(completedExercise);
      });

      const addedExercises = await CompletedExercise.insertMany(exercises, {
        session: session,
      });

      if (!addedExercises) {
        throw new Error('Adding completedExercises failed');
      }

      await session.commitTransaction();

      const response = await Class.findOne({ _teacherId: req.body.userId })
        .populate('teacher')
        .populate('students')
        .populate('exercises')
        .exec();

      session.endSession();
      return res.status(200).json(response);
    } catch (err) {
      await session.abortTransaction();
      next(err);
    }
  };
}

export default ClassController;
