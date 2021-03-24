import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator';
import {
  RequestValidationError
} from '../errors';


export const validateRequest = (
  req: Request, 
  res: Response, 
  next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // return res.status(400).json({ errors: errors.array() });
    throw new RequestValidationError(errors.array());
  }

  next();
}