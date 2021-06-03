import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  isAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
} from 'bay-common';
import Order from '../models/order';

const router = express.Router();

router.post(
  '/api/payments',
  isAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({ success: true });
  }
);

export { router as createChargeRouter };
