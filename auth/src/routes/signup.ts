import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import {
  BadRequestError,
} from '../errors';
import { User } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

interface UserResponse {
  errors: Array<string>;
  email: string;
  username: string;
}

router.post('/api/users/signup', [
  body('email').isEmail().
    withMessage("valid email must be provided"), 
  body('password').trim().isLength({min: 4, max: 10}).
    withMessage("password must be at least 4 and at most 10 characters"),
    validateRequest
], 
  async (req: Request, res: Response) => {
  
  const {email, password} = req.body;
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new BadRequestError("This email already exists")
  }
  const newUser = User.build({email, password});
  
  await newUser.save()

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_KEY as string)
  
  req.session = {
    jwt: token
  }

  res.status(201).send(newUser);
});

export { router as signupRouter };