import { IAppError } from './utilities.types';

class AppError implements IAppError {
  public details?: string;
  public message: string = 'Something went wrong';
  public name: string = 'Error';
  public stack?: string;
  public status: number = 500;
  public timestamp: number = Date.now();
}

class NotFoundError extends AppError {
  public message: string = 'Resource not found';
  public name: string = 'Not Found';
  public status: number = 404;
}


export {
  AppError,
  NotFoundError,
};
