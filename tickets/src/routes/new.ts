import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { validateRequest, isAuth } from 'bay-common'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.post('/api/tickets', isAuth, [
  body('title').not().isEmpty().withMessage('title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('price must be greater than 0')
],
  validateRequest,
  async (req: Request, res: Response) => {

  const { title, price } = req.body;
  
  console.log('req.session', req.currentUser)
    
  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id
  });
    
  console.log('** /api/tickets ', ticket)
  try {
    await ticket.save();
  } catch (error) {
    console.error(error)
  }
  
  console.log('** /api/tickets ', ticket)  
  res.status(201).send(ticket)
})

export { router as createTicketRouter }
 