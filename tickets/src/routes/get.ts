import express, {Request, Response} from 'express';
import { RouteNotFoundError } from 'bay-common'
import { Ticket } from '../models/ticket'

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw new RouteNotFoundError()
  }

  res.send(ticket);
})

export { router as getTicketRouter }