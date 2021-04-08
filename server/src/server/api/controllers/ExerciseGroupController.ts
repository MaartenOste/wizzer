import { NextFunction, Response } from 'express';
import { ExerciseGroup, Class, CompletedExercise, ICompletedExercise } from '../../models/mongoose';
import { Request } from './CustomRequest';
import { NotFoundError } from '../../utilities';
import { default as mongoose } from 'mongoose';
import ClassController from './ClassController';

class ExerciseGroupController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filters } = req.query;
      let filter;
      if (filters) {
        let temp = filters.split('%22').join('"');
        temp = temp.split(';');

        let tempFilters: any = {};
        temp.forEach((el: any) => {
          el = el.split(':');
          tempFilters[el[0]] = el[1];
        });

        filter = { $and: [tempFilters] };
      }

      let exerciseGroups = await ExerciseGroup.find(filter)
        .populate('createdBy')
        .sort({ name: -1 })
        .exec();
      return res.status(200).json(exerciseGroups);
    } catch (err) {
      next(err);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const exerciseGroup = await ExerciseGroup.findById(id)
        .populate('createdBy')
        .exec();
      return res.status(200).json(exerciseGroup);
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
      const exerciseGroupUpdate = {
        _id: id,
        title: req.body.title,
        description: req.body.description,
        instructionVideo: req.body.instructionVideo,
        _createdBy: req.body._createdBy,
        exercises: req.body.exercises,
        example: req.body.example,
        type: req.body.type,
        subType: req.body.subType,
        slug: req.body.slug,
        _modifiedAt: new Date().getTime(),
      };

      const exerciseGroup = await ExerciseGroup.findOneAndUpdate(
        { _id: id },
        exerciseGroupUpdate,
        {
          new: true,
        },
      ).exec();

      if (!exerciseGroup) {
        throw new NotFoundError();
      }
      return res.status(200).json(exerciseGroup);
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
      const initialClass = await Class.findOne({
        _teacherId: req.session.passport.user.id,
      }).exec();

      const exerciseGroupUpdate = {
        title: req.body.title,
        description: req.body.description,
        instructionVideo: req.body.instructionVideo,
        _createdBy: req.session.passport.user.id,
        exercises: req.body.exercises,
        example: req.body.example,
        type: req.body.type,
        subType: req.body.subType
      };

      const session = await mongoose.startSession();
      session.startTransaction();

      const exerciseGroup = new ExerciseGroup(
        exerciseGroupUpdate
      )
      exerciseGroup.save({session:session});

      if (!exerciseGroup) {
        throw new NotFoundError();
      }

      const data = {
        _exerciseGroupId: exerciseGroup._id,
        public: false,
        _addedAt: Date.now(),
      };

      const classGroup = await Class.updateOne(
        { _teacherId:  req.session.passport.user.id },
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
          _exerciseId: exerciseGroup._id,
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
      session.endSession();
      return res.status(200).json(exerciseGroup);
    } catch (err) {
      next(err);
    }
  };
}

export default ExerciseGroupController;
