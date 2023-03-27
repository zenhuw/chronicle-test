import { NextFunction, Response } from 'express';
import { isNil } from 'ramda';
import { RequestModified } from '../interfaces/auth.interface';

export const isAuthenticated = (req: RequestModified, res: Response, next: NextFunction) => {
  if (isNil(req.user)) {
    return res.status(401).send('Not Authorized');
  }
  next();
};
