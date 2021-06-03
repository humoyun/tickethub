import { TicketCreatedPublisher } from '../events/ticket-created-publisher';
import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { validateRequest, isAuth } from 'bay-common'
import { Ticket } from '../models/ticket'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post('/api/tickets', isAuth, [
  body('title').not().isEmpty().withMessage('title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('price must be greater than 0')
],
  validateRequest,
  async (req: Request, res: Response) => {

  const { title, price } = req.body;
  
  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id
  });
  
  try {
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
    });
  } catch (error) {
    console.error('[ticket-created-publisher]', error);
  }
  
  res.status(201).send(ticket)
})

export { router as createTicketRouter }
 