import { NextFunction, Response } from 'express';
import { User } from '../../models/mongoose';
import { Request } from './CustomRequest';
import { AuthService, IConfig } from '../../services';
import { NotFoundError } from '../../utilities';
import passport = require('passport');

class UserController {
  private authService: AuthService;
  private config: IConfig;

  constructor(config: IConfig, authService: AuthService) {
    this.config = config;
    this.authService = authService;
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let users = await User.find()
        .sort({ _createdAt: -1 })
        .exec();

      return res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const member = await User.findById(id).exec();
      return res.status(200).json(member);
    } catch (err) {
      next(err);
    }
  };

  showUsersFromClass = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { classId } = req.params;
      const students = await User.find().where('_classId', classId);
      return res.status(200).json(students);
    } catch (err) {
      next(err);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {};

  edit = async (req: Request, res: Response, next: NextFunction) => {};

  store = async (req: Request, res: Response, next: NextFunction) => {};

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const { id } = req.params;

    try {
      const userUpdate = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        _classId: req.body._classId,
        localProvider: req.body.localProvider,
        smartschoolProvider: req.body.smartschoolProvider,
        _modifiedAt: new Date().getTime(),
      };

      const user = await User.findOneAndUpdate({ _id: id }, userUpdate, {
        new: true,
      }).exec();
      if (!user) {
        throw new NotFoundError();
      }
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  signInWithSmartschool = passport.authenticate('smartschool', {
    session: true,
  });

  smartschoolCallback = passport.authenticate('smartschool', {
    session: true,
    failureRedirect: 'https://wizzer.be/login?failed=true',
  });

  smartschoolRedirect = async (req: Request, res: Response) => {
    res.redirect(
      `https://wizzer.be/login/redirect/${req.session.passport.user.id}`,
    );
  };

  logout = async (req: Request, res: Response) => {
    req.logout();
    res.sendStatus(200);
  };
}

export default UserController;
