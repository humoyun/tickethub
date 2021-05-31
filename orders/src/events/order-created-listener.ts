import { NatsListener, Subjects, OrderCreatedEvent } from "bay-common";
import { Message } from "node-nats-streaming";

/**
 * we need to provide some mapping between `subject` and event `data` in onMessage
 * so that we can verify what we are receiving is what we expected 
 */
export class OrderCreatedListener extends NatsListener<OrderCreatedEvent> {
  // makes sure subject never changes to anything, even to other Subjects types like OrderUpdated
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = 'orders-service';

  onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    console.log('Event data: ', data);
    
    // some condition
    msg.ack();
  }
}