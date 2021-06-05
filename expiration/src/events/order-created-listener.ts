import { NatsListener, Subjects, OrderCreatedEvent } from "bay-common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from '../queues/expiration-queue'


export class OrderCreatedListener extends NatsListener<OrderCreatedEvent> {
  // makes sure subject never changes to anything, even to other Subjects types like OrderCreated
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = "expiration-service";

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // TODO:
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.warn('*** waiting expiration job:orderId ', data.id)
    await expirationQueue.add({ orderId: data.id },
      { delay: 60000 }); // TODO: 10000 (60 sec) tempo after checking put back delay

    msg.ack();
  }
};