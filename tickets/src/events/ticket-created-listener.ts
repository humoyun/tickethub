import { NatsListener, Subjects, TicketCreatedEvent } from "bay-common";
import { Message } from "node-nats-streaming";

/**
 * we need to provide some mapping between `subject` and event `data` in onMessage
 * so that we can verify what we are receiving is what we expected 
 */
export class TicketCreatedListener extends NatsListener<TicketCreatedEvent> {
  // makes sure subject never changes to anything, even to other Subjects types like OrderCreated
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'ticket-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data: ', data);
    
    // some condition
    msg.ack();
  }
}