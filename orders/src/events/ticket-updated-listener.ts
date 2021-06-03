import { NatsListener, Subjects, TicketUpdatedEvent } from "bay-common";
import { Message } from "node-nats-streaming";
import Ticket from '../models/ticket'
import { queueGroupName } from './constants'

/**
 * we need to provide some mapping between `subject` and event `data` in onMessage
 * so that we can verify what we are receiving is what we expected 
 */
export class TicketUpdatedListener extends NatsListener<TicketUpdatedEvent> {
  // makes sure subject never changes to anything, even to other Subjects types like OrderCreated
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // emitted from Ticket service
    console.log('ticket-updated-event data: ', data.id);
    // versioning is important to keep data integrity across services (replicated data)
    // keep track of correct ordering of events by versioning, events should come in sequence
    // e.g. 1, 2, 3, ...
    const ticket = await Ticket.findByEvent(data);

    // if we cannot find ticket with specific version, 
    // then we don't ack on message, that means NATS automatically re-emit 
    // the event failed to process after 5 seconds, maybe this time we might
    // be able to find the event with correct version and then call `ack`
    // to see this in action, take a look at `test-script-to-check-occ` file on /tests folder
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    const { title, price } = data;
    ticket.set({ title, price })
    await ticket.save();

    msg.ack();
  }
}