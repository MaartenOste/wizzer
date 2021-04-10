import * as Express from 'express';

export interface Request extends Express.Request<any> {
  params: any;
  body: any;
  query: any;
  user?: any;
  session?: any;
  logout:any;
}
