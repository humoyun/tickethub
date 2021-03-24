import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../errors'

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const isAuth = ( req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new UnauthorizedError();
  }

  next();
}