import express, { Request, Response } from 'express';
import { isAuth, NotFoundError, OrderStatus, UnauthorizedError } from 'bay-common'
import { OrderCancelledPublisher } from '../events/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'
import Order from '../models/order'

const router = express.Router()

/**
 * TODO: probably we also need to define some authorization with roles, not everybody can update
 */

/**
 * If an existing resource is modified, either the 200 (OK) or 204 (No Content) response 
 * codes SHOULD be sent to indicate successful completion of the request.
 */

router.delete('/api/orders/:orderId', isAuth, async (req: Request, res: Response) => {
  
  const order = await Order.findById(req.params.orderId).populate('ticket');
  if (!order) {
    throw new NotFoundError();
  }
  
  if (order.userId !== req.currentUser!.id) {
    throw new UnauthorizedError();
  }

  console.log('order ', order)
  
  try {
    order.status = OrderStatus.Cancelled;
    await order.save();
    // publish an event
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      }
    });

  } catch (error) {
    console.error(error)
  }
  
  res.status(204).send(order)
})

export { router as deleteOrderRouter }
 