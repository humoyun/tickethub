import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { validateRequest, isAuth, NotFoundError, UnauthorizedError } from 'bay-common'
import { TicketUpdatedPublisher } from '../events/ticket-updated-publisher'; 
import { natsWrapper } from '../nats-wrapper'
import { Ticket } from '../models/ticket'

const router = express.Router()

/**
 * TODO: probably we also need to define some authorization with roles, not everybody can update
 */

/**
 * If an existing resource is modified, either the 200 (OK) or 204 (No Content) response 
 * codes SHOULD be sent to indicate successful completion of the request.
 */

router.put('/api/tickets/:id', isAuth, [
  body('title').not().isEmpty().withMessage('title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('price must be greater than 0')
],
  validateRequest,
  async (req: Request, res: Response) => {
  
  const ticket = await Ticket.findById(req.params.id)
  if (!ticket) {
    throw new NotFoundError(); // TODO: replace with NotFoundError
  }
  
  if (ticket.userId !== req.currentUser!.id) {
    throw new UnauthorizedError();
  }
  const { title, price } = req.body;  
  ticket.set({
    title,
    price
  });
  
  try {
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
    })

  } catch (error) {
    console.error(error)
  }
  
  res.status(204).send(ticket)
})

export { router as updateTicketRouter }
 