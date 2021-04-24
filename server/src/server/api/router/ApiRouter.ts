import { default as express, Application, Response, Router } from 'express';
import { Request } from '../controllers/CustomRequest';
import { IConfig, AuthService, Role } from '../../services';
import {
  ClassController,
  CompletedExerciseController,
  ExerciseGroupController,
  UserController,
} from '../controllers';

class ApiRouter {
  public router: Router;

  private userController: UserController;
  private exerciseGroupController: ExerciseGroupController;
  private classController: ClassController;
  private completedExerciseController: CompletedExerciseController;

  private config: IConfig;
  private authService: AuthService;

  constructor(config: IConfig, authService: AuthService) {
    this.config = config;
    this.authService = authService;

    this.router = express.Router();

    this.registerControllers();
    this.registerRoutes();
  }

  private registerControllers(): void {
    this.userController = new UserController(this.config, this.authService);
    this.exerciseGroupController = new ExerciseGroupController();
    this.classController = new ClassController();
    this.completedExerciseController = new CompletedExerciseController();
  }

  private checkUser(req: Request, res: Response, next: any) {
    if (req.session.passport) {
      next();
    } else {
      return res.sendStatus(401);
    }
  }

  private checkUserAndTeacher(req: Request, res: Response, next: any) {
    if (req.session.passport.user.userType === 'Teacher') {
      next();
    } else {
      return res.sendStatus(401);
    }
  }

  private registerRoutes(): void {
    /*
     * User routes
     */
    this.router.get('/users', this.checkUser, this.userController.index);
    this.router.get('/users/:id', this.checkUser, this.userController.show);
    this.router.put('/users/:id', this.checkUser, this.userController.update);
    this.router.get(
      '/login/smartschool',
      this.userController.signInWithSmartschool,
    );
    this.router.get(
      '/auth/smartschool',
      this.userController.smartschoolCallback,
      this.userController.smartschoolRedirect,
    );
    this.router.get('/logout', this.userController.logout);

    /*
     * Class routes
     */
    this.router.get('/classes', this.checkUser, this.classController.index);
    this.router.post('/classes', this.classController.create);
    this.router.get('/classes/topthree/:classId', this.checkUser, this.classController.getTopThree);
    this.router.get('/classes/:id', this.checkUser, this.classController.show);
    this.router.get(
      '/classes/user/:id',
      this.checkUser,
      this.classController.getClassByUserId,
    );
    this.router.put(
      '/classes/:id',
      this.checkUserAndTeacher,
      this.classController.update,
    );
    this.router.post(
      '/classes/join/:id/:userId',
      this.checkUser,
      this.classController.joinClass,
    );
    this.router.post(
      '/classes/delete_exercise/:exerciseId',
      this.checkUserAndTeacher,
      this.classController.deleteExercise,
    );
    this.router.post(
      '/classes/add_exercise/:exerciseId',
      this.checkUserAndTeacher,
      this.classController.addExercise,
    );
    /*
     * Exercises routes
     */
    this.router.get(
      '/exercises',
      this.checkUser,
      this.exerciseGroupController.index,
    );
    this.router.get(
      '/exercises/:id',
      this.checkUser,
      this.exerciseGroupController.show,
    );
    this.router.put(
      '/exercises/:id',
      this.checkUserAndTeacher,
      this.exerciseGroupController.update,
    );
    this.router.post(
      '/exercises',
      this.checkUserAndTeacher,
      this.exerciseGroupController.create,
    );

    /*
     * CompletedExercises routes
     */
    this.router.get(
      '/completed_exercises',
      this.checkUser,
      this.completedExerciseController.index,
    );
    this.router.get(
      '/completed_exercises/:id',
      this.checkUser,
      this.completedExerciseController.show,
    );
    this.router.put(
      '/completed_exercises/:id',
      this.checkUser,
      this.completedExerciseController.update,
    );
    this.router.get(
      '/completed_exercises/user/:userId',
      this.checkUser,
      this.completedExerciseController.getCompletedExByUser,
    );
    this.router.get(
      '/completed_exercises/:classId/:exId',
      this.checkUser,
      this.completedExerciseController.getCompletedExByClassAndEx,
    );
  }
}

export default ApiRouter;
