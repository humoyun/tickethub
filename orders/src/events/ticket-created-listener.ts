import { NatsListener, Subjects, TicketCreatedEvent } from "bay-common";
import { Message } from "node-nats-streaming";
import Ticket from '../models/ticket'

/**
 * we need to provide some mapping between `subject` and event `data` in onMessage
 * so that we can verify what we are receiving is what we expected 
 */
export class TicketCreatedListener extends NatsListener<TicketCreatedEvent> {
  // makes sure subject never changes to anything, even to other Subjects types like OrderCreated
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'orders-service';

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('ticket-created-event data: ', data.id);
    // emitted from Ticket service
    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price });
    // save a copy of ticket on orders service (bounded context)
    await ticket.save();

    msg.ack();
  }
}