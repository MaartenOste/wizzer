import { NextFunction, Response } from 'express';
import { Class } from '../../models/mongoose';
import { Request } from './CustomRequest';
import { NotFoundError } from '../../utilities';

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
}

export default ClassController;
