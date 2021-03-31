import {
  default as express,
  Application,
  Request,
  Response,
  Router,
} from 'express';
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

  private registerRoutes(): void {
    /*
     * User routes
     */
    this.router.get('/users', this.userController.index);
    this.router.get('/users/:id', this.userController.show);
    this.router.put('/users/:id', this.userController.update);
    this.router.get('/login/smartschool', this.userController.signInWithSmartschool);
    this.router.get('/auth/smartschool', this.userController.smartschoolCallback, this.userController.smartschoolRedirect);
    
    /*
     * Class routes
     */
    this.router.get('/classes', this.classController.index);
    this.router.get('/classes/:id', this.classController.show);
    this.router.get('/classes/user/:id', this.classController.getClassByUserId);
    this.router.put('/classes/:id', this.classController.update);
    this.router.post(
      '/classes/join/:id/:userId',
      this.classController.joinClass,
    );
    this.router.post(
      '/classes/delete_exercise/:exerciseId',
      this.classController.deleteExercise,
    );
    this.router.post(
      '/classes/add_exercise/:exerciseId',
      this.classController.addExercise,
    );
    /*
     * Exercises routes
     */
    this.router.get('/exercises', this.exerciseGroupController.index);
    this.router.get('/exercises/:id', this.exerciseGroupController.show);
    this.router.put('/exercises/:id', this.exerciseGroupController.update);

    /*
     * CompletedExercises routes
     */
    this.router.get(
      '/completed_exercises',
      this.completedExerciseController.index,
    );
    this.router.get(
      '/completed_exercises/:id',
      this.completedExerciseController.show,
    );
    this.router.put(
      '/completed_exercises/:id',
      this.completedExerciseController.update,
    );
    this.router.get(
      '/completed_exercises/user/:userId',
      this.completedExerciseController.getCompletedExByUser,
    );
    this.router.get(
      '/completed_exercises/:classId/:exId',
      this.completedExerciseController.getCompletedExByClassAndEx,
    );
  }
}

export default ApiRouter;
