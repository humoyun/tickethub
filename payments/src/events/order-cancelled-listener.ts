import {
  NatsListener,
  Subjects,
  OrderCancelledEvent,
  OrderStatus
} from "bay-common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./constants";
import Order from "../models/order";

export class OrderCancelledListener extends NatsListener<OrderCancelledEvent> {
  // makes sure subject never changes to anything, even to other Subjects types like OrderCreated
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    console.log('order-created-event:orderId', data.id);

    // including version is not very important, but for being consistent we do include
    // because we don't have order updated event (but who knows maybe we might end up adding it)
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1
    });
    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled })
    await order.save();

    msg.ack();
  }
};