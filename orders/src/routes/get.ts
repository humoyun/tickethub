import express, {Request, Response} from 'express';
import { NotFoundError, UnauthorizedError, isAuth } from 'bay-common'
import Order from '../models/order'

const router = express.Router();

router.get('/api/orders/:orderId', isAuth, async (req: Request, res: Response) => {
  const orderId = req.params.orderId;

  const order = await Order.findById(orderId).populate('ticket');
  if (!order) {
    throw new NotFoundError()
  }
  if (order.userId !== req.currentUser!.id) {
    throw new UnauthorizedError()
  }

  res.send(order);
});

export { router as getOrderRouter }