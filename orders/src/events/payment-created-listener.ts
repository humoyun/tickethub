import { NatsListener, Subjects, PaymentCreatedEvent, OrderStatus } from "bay-common";
import { Message } from "node-nats-streaming";
import Order from '../models/order'

/**
 * we need to provide some mapping between `subject` and event `data` in onMessage
 * so that we can verify what we are receiving is what we expected 
 */
export class PaymentCreatedListener extends NatsListener<PaymentCreatedEvent> {
  // makes sure subject never changes to anything, even to other Subjects types like OrderCreated
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = 'orders-service';

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    console.log('ticket-created-event data: ', data.id);
    // emitted from Ticket service
    const { id, orderId } = data;
    const order = await Order.findById(orderId);
    // save a copy of ticket on orders service (bounded context)
    if (!order) {
      throw new Error("Error not found");
    }
    order.set({
      status: OrderStatus.Complete
    });
    // no need to emit order-updated-event, because in the context of our app, once order
    // is complete, then there is no further states so version will not ne incremented

    await order.save();

    msg.ack();
  }
}