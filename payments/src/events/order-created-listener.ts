import { NatsListener, Subjects, OrderCreatedEvent } from "bay-common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./constants";
import Order from "../models/order";

export class OrderCreatedListener extends NatsListener<OrderCreatedEvent> {
  // makes sure subject never changes to anything, even to other Subjects types like OrderCreated
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    console.log('order-created-event:orderId ', data.id);

    const order = Order.build({
      id: data.id,
      status: data.status,
      version: data.version,
      userId: data.userId,
      price: data.ticket.price,
    });

    await order.save();

    msg.ack();
  }
};