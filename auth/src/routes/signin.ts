import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { Password } from '../utils/password';
import {
  BadRequestError
} from '../errors';

const router = express.Router();

router.post('/api/users/signin', [
  body('email').isEmail().withMessage("Email must be valid"),
  body('password').trim().notEmpty().withMessage("You must supply password"),
  validateRequest
], async (req: Request, res: Response) => {
  const {email, password} = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new BadRequestError("Invalid credentials");
  }

  const isValidUser = await Password.verify(existingUser.password, password);
  if (!isValidUser) {
    throw new BadRequestError("Invalid credentials");
  }
  
  const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY as string)
  console.log('[signin] jwt token', token)

  req.session = {
    jwt: token
  }

  res.status(200).json(existingUser);
})

export { router as signinRouter };