import { NextFunction, Response } from 'express';
import { CompletedExercise } from '../../models/mongoose';
import { Request } from './CustomRequest';
import { NotFoundError } from '../../utilities';

class CompletedExerciseController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let completedExercise = await CompletedExercise.find()
        .populate('completedBy')
        .populate('class')
        .populate('exercise')
        .exec();
      return res.status(200).json(completedExercise);
    } catch (err) {
      next(err);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const completedExercise = await CompletedExercise.findById(id)
        .populate('completedBy')
        .populate('class')
        .populate('exercise')
        .exec();
      return res.status(200).json(completedExercise);
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
      const completedExerciseUpdate = {
        _id: id,
        score: req.body.score,
        answers: req.body.answers,
        _completedBy: req.body._completedBy,
        _classId: req.body._classId,
        _exerciseId: req.body._exerciseId,
        _modifiedAt: new Date().getTime(),
      };

      const completedExercise = await CompletedExercise.findOneAndUpdate(
        { _id: id },
        completedExerciseUpdate,
        {
          new: true,
        },
      ).exec();

      if (!completedExercise) {
        throw new NotFoundError();
      }
      return res.status(200).json(completedExercise);
    } catch (err) {
      next(err);
    }
  };

  getCompletedExByClassAndEx = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const { classId, exId } = req.params;

    try {
      const completedExercises = await CompletedExercise.find({
        _classId: classId,
        _exerciseId: exId,
      })
        .populate('completedBy')
        .populate('class')
        .populate('exercise')
        .exec();

      if (!completedExercises) {
        throw new NotFoundError();
      }
      return res.status(200).json(completedExercises);
    } catch (err) {
      next(err);
    }
  };

  getCompletedExByUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const { userId } = req.params;

    try {
      const completedExercises = await CompletedExercise.find({
        _completedBy: userId,
      })
        .populate('completedBy')
        .populate('class')
        .populate('exercise')
        .exec();

      if (!completedExercises) {
        throw new NotFoundError();
      }

      return res.status(200).json(completedExercises);
    } catch (err) {
      next(err);
    }
  };
}

export default CompletedExerciseController;
