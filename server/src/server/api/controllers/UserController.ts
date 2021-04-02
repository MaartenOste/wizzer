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
  /*
  signupLocal = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const {
      email,
      firstname,
      lastname,
      phoneNumber,
      password,
      _memberTypeId,
    } = req.body;

    let founMember = await Member.findOne({ email: email });
    if (founMember) {
      return res.status(403).json({ error: 'Email is already in use' });
    }

    const newMember: IMember = new Member({
      firstname: firstname,
      lastname: lastname,
      email: email,
      phoneNumber: phoneNumber,
      localProvider:{
        password: password,
      },
      _memberTypeId
    });

    const member: IMember = await newMember.save();

    const token = this.authService.createToken(member);
    return res.status(200).json({
      email: member.email,
      id: member._id,
      token: `${token}`,
      strategy: 'local',
    });
  };
  */

  /*  signInLocal = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    this.authService.passport.authenticate(
      'local',
      { session: this.config.auth.smartschool.session },
      (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(new NotFoundError());
        }

        const token = this.authService.createToken(user);
        return res.status(200).json({
          email: user.email,
          id: user._id,
          token: `${token}`,
          strategy: 'local',
          type: user._memberTypeId,
        });
      },
    )(req, res, next);
  };
*/
  signInWithSmartschool = passport.authenticate('smartschool', {
    session: true,
  });

  smartschoolCallback = passport.authenticate('smartschool', {
    session: true,
    failureRedirect: 'http://localhost:3000/login?failed=true',
  });

  smartschoolRedirect = async (req: Request, res: Response) => {
    res.redirect(`http://localhost:3000/login/redirect/${req.session.passport.user.id}`);
  };

  logout = async (req: Request, res: Response) => {
    req.session.destroy(function(err: any) {
      // cannot access session here
    });
  };
}

/*smartschoolCallback = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    passport.authenticate('smartschool', { failureRedirect: 'http://localhost:3000/login' }),
    function(req:any, res:any) {
      console.log('smartschoolCallback');

      // Successful authentication, redirect home.
      res.redirect('http://localhost:3000/klas');
    };
  };
}*/

export default UserController;
