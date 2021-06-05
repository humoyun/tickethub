import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { stripe } from '../stripe';
import {
  isAuth,
  validateRequest,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  OrderStatus,
} from 'bay-common';
import Order from '../models/order';
import Payment from '../models/payment';
import {PaymentCreatedPublisher} from '../events/payment-created-publisher'
import { natsWrapper } from '../nats-wrapper'


const router = express.Router();

router.post(
  '/api/payments',
  isAuth,
  [
    body('token').not().isEmpty().withMessage('token should be provided'),
    body('orderId').not().isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // valid mongo id
      .withMessage('valid orderId should be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('cannot make payment for expired/cancelled order');
    }

    const resp = await stripe.charges.create({
      amount: order.price * 100, // dollar to cents
      currency: 'usd',
      source: token,
      description: 'ticket order payment'
    });

    const payment = await new Payment({
      orderId,
      stripeId: resp.id,
    }).save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: resp.id,
    })

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
