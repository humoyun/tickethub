import { validateRequest, BadRequestError } from 'bay-common'; 
import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Password } from '../utils/password';

const router = express.Router();

router.post('/api/users/signin', [
  body('email').isEmail().withMessage("Email must be valid"),
  body('password').trim().notEmpty().withMessage("You must supply password"),
  validateRequest
], async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new BadRequestError("Invalid credentials");
  }

  const isValidUser = await Password.verify(existingUser.password, password);
  if (!isValidUser) {
    throw new BadRequestError("Invalid credentials");
  }
  
  const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY as string)

  /**
   * Gotcha: be careful when you type url in the browser :)
   * if you forget to use https then cookie is not set in browser
   */
  req.session = {
    jwt: token
  }

  res.status(200).json(existingUser);
})

export { router as signinRouter };