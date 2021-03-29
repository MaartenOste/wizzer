import { NextFunction, Response } from 'express';
import { ExerciseGroup } from '../../models/mongoose';
import { Request } from './CustomRequest';
import { NotFoundError } from '../../utilities';

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
}

export default ExerciseGroupController;
