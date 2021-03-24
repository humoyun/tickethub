import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

// reach into existing type definition and make modifications to it
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const currentUser = ( req: Request, res: Response, next: NextFunction) => {
  const userJwt = req.session?.jwt;
  if (!userJwt) {
    return next();
  }

  let payload: UserPayload;
  
  try {
    payload = jwt.verify(userJwt, process.env.JWT_KEY as string) as UserPayload;
    req.currentUser = payload;
  } catch (error) {
    throw new Error("")  
  }

  next();
}