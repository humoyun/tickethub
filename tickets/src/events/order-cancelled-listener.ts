import { NatsListener, Subjects, OrderCancelledEvent } from "bay-common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/ticket";
import { queueGroupName } from "./constants";
import { TicketUpdatedPublisher } from './ticket-updated-publisher';

export class OrderCancelledListener extends NatsListener<OrderCancelledEvent> {
  // makes sure subject never changes to anything, even to other Subjects types like OrderCreated
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    console.log('order-cancelled-event:orderId ', data.id);
    
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found in tickets-db")
    }
    
    // optional values don't play well with null, so we use undefined instead
    ticket.set({ orderId: undefined });
    await ticket.save();
    // ticket updated its version, we need to let know other services 
    // which are interested in tickets like orders
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version, // this is important, others services should update their version of same ticket
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
      orderId: undefined
    });

    msg.ack();
  }
};