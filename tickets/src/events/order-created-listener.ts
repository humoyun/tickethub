import { NatsListener, Subjects, OrderCreatedEvent } from "bay-common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/ticket";
import { queueGroupName } from "./constants";
import { TicketUpdatedPublisher } from './ticket-updated-publisher';

export class OrderCreatedListener extends NatsListener<OrderCreatedEvent> {
  // makes sure subject never changes to anything, even to other Subjects types like OrderCreated
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    console.log('order-created-event:orderId ', data.id);
    
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found in tickets-db (possibly with provided version)")
    }
    
    ticket.set({ orderId: data.id })
    await ticket.save();
    // ticket updated its version, we need to let know other services 
    // which are interested in tickets like orders
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version, // only this one changed
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
      orderId: ticket.orderId
    });

    msg.ack();
  }
};