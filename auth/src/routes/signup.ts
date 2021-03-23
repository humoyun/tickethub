import express, {Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import {
  RequestValidationError,
  BadRequestError,
} from '../errors';
import { User } from '../models/user';

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
    withMessage("password must be at least 4 and at most 10 characters")
], 
  async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // return res.status(400).json({ errors: errors.array() });
    throw new RequestValidationError(errors.array());
  }  
  
  const {email, password} = req.body;
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new BadRequestError("This email already exists")
  }
  const newUser = User.build({email, password});
  
  await newUser.save()

  res.status(201).json(newUser);
});

export { router as signupRouter };