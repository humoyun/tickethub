import express, {Request, Response} from 'express';
import { currentUser } from 'bay-common';

const router = express.Router();

router.get(
  '/api/users/me', 
  currentUser, 
  async (req: Request, res: Response) => {
  res.send({ me: req.currentUser || null });
})

export { router as currentUserRouter };