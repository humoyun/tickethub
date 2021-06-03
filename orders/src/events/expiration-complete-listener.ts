import { NatsListener, Subjects, ExpirationCompleteEvent, OrderStatus } from "bay-common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './constants'
import { OrderCancelledPublisher } from './order-cancelled-publisher'
import Order from '../models/order'
import { natsWrapper } from "../nats-wrapper";


export class ExpirationCompleteListener extends NatsListener<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    // emitted from Ticket service
    console.log('expiration-complete-event:orderId ', data.orderId);
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) {
      throw new Error('expired order not found')
    }
    // if already completed, payment was provided
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled
    });
    await order.save();

    const publisher = new OrderCancelledPublisher(natsWrapper.client)
    await publisher.publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    });

    msg.ack();
  }
}