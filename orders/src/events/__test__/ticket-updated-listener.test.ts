import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from 'bay-common';
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import Ticket from '../../models/ticket';


const setup = async () => {
  // 1. create an instance of the listener 
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // 2. create and save a ticket
  const objectId = new mongoose.Types.ObjectId().toHexString();
  const userId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id: objectId,
    title: 'some ticket',
    price: 1234
  })
  await ticket.save();
  
  // 3.create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'updated ticket',
    price: 832,
    userId
  };
  // 4. create a fake message object, and mock `ack` method
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg };
}

it('finds, updates and saves the ticket', async () => {
  // 4. call the `onMessage` function with the data object + message object
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  // 5. assert to make sure the ticket was created
  const updatedTicket = await Ticket.findById(ticket.id)
  
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  // 4. call the `onMessage` function with the data object + message object
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg);
  // 5. assert to make sure the ticket was created
  expect(msg.ack).toHaveBeenCalled();
});

it('not ack when events out of order, event should not be processed', async () => {
  const { listener, data, msg } = await setup();
  
  data.version = 11; // there are 10 missing events
  try {
    await listener.onMessage(data, msg);
  } catch (err) {
  }

  expect(msg.ack).not.toHaveBeenCalled();
});
