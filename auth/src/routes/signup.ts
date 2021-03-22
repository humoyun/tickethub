import express, {Request, Response} from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post('/api/users/signup', [
  body('email').isEmail().
    withMessage("valid email must be provided"), 
  body('password').trim().isLength({min: 4, max: 10}).
    withMessage("password must be at least 4 and at most 10 characters")
], 
  (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }  
  
  const {email, password} = req.body;
  console.log(`[auth-service] new user ${email} signup`)
  res.json({ msg: 'good' })
});

export { router as signupRouter };