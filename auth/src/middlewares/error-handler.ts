import { Request, Response, NextFunction } from 'express'
import {
  BaseError
} from '../errors'

/**
 * 
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("[global error handler]", err.message);

  if (err instanceof BaseError) {
    return res.
      status(err.statusCode).
      json({ errors: err.serializeErrors() });
  }

  res.status(400).json({ msg: "error thrown" })
  // next();
}