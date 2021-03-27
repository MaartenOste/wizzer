import { NextFunction, Response } from 'express';
import { Class, CompletedExercise } from '../../models/mongoose';
import { Request } from './CustomRequest';
import { NotFoundError } from '../../utilities';
import { assert } from 'console';

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
      ).exec();

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
    const { classId, exerciseId } = req.params;

    try {
    
      const classUpdate = {
        _id: classId,
        name: req.body.name,
        _exercises: req.body._exercises,
        _modifiedAt: new Date().getTime(),
        _studentIds: req.body._studentIds,
        _teacherId: req.body._teacherId,
        slug: req.body.slug,
      };

      const classSession = await Class.startSession();
      const exerciseSession = await CompletedExercise.startSession();
      classSession.startTransaction();
      exerciseSession.startTransaction();

      const classGroup = await Class.findOneAndUpdate(
        { _id: classId },
        classUpdate,
        {
          useFindAndModify: false,
          new: true,
          session: classSession
        },
      ).populate('teacher')
      .populate('students')
      .populate('exercises')

      const deletetExercises = await CompletedExercise.deleteMany({
        $and:[{_classId: classId},{_exerciseId: exerciseId}]
      }).session(exerciseSession)
      

      if (!classGroup) {
        await classSession.abortTransaction();
        await exerciseSession.abortTransaction();
        throw new NotFoundError();
      }

      if (!deletetExercises.ok) {
        await classSession.abortTransaction();
        await exerciseSession.abortTransaction();
        throw new Error('Deleting completedExercises failed');
      }
      await classSession.commitTransaction();
      await exerciseSession.commitTransaction();

      classSession.endSession();
      exerciseSession.endSession();
      return res.status(200).json(classGroup);
    } catch (err) {
      next(err);
    }
  };
}

export default ClassController;
