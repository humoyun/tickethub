import { OrderCreatedPublisher } from '../events/order-created-publisher';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose'
import { body } from 'express-validator';
import {
  validateRequest,
  OrderStatus,
  isAuth,
  NotFoundError,
  BadRequestError
} from 'bay-common'
import Order from '../models/order'
import Ticket from '../models/ticket'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()
const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 min

router.post('/api/orders', isAuth, [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // valid mongo id
    .withMessage('ticketId is required'),
],
  validateRequest,
  async (req: Request, res: Response) => {
  /**
   * case 1. find the ticket user is trying to order
   * if not found then 
   */
  const { ticketId } = req.body;
  const ticket = await Ticket.findById(ticketId);
  
  if (!ticket) {
    throw new NotFoundError(); // todo: change into not-found-error
  }
    
  /**
   * case 2. make sure that this ticket is not reserved already
   */
  const isReserved = await ticket.isReserved()
  if (isReserved) {
    throw new BadRequestError("the ticket is already reserved")
  }
  
  /**
   * case 3. calculate the expiration for this ticket-order
   */
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

  /**
   * case 4. build the order and save.
   * publish an event to other services who might me interested
   */
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  });
  
  
  try {
    await order.save();
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt:order.expiresAt.toISOString(), // explanation
      ticket: {
        id: ticket.id,
        price: ticket.price,
      }
    })
  } catch (error) {
    console.error(error)
  }
  
  res.status(201).send(order);
})

export { router as createOrderRouter }
 