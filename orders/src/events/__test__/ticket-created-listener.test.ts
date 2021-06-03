import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from 'bay-common';
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import Ticket from '../../models/ticket';


const setup = async () => {
  // 1. create an instance of the listener 
  const listener = new TicketCreatedListener(natsWrapper.client);
  // 2. create a fake event
  const objectId = new mongoose.Types.ObjectId().toHexString();
  const userId = new mongoose.Types.ObjectId().toHexString();
  const data: TicketCreatedEvent['data'] = {
    id: objectId,
    version: 1,
    title: 'some ticket',
    price: 1234,
    userId
  }
  // 3. create a fake message object, and mock `ack` method
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg };
}

it('creates and saves a ticket', async () => {
  // 4. call the `onMessage` function with the data object + message object
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  // 5. assert to make sure the ticket was created
  const ticket = await Ticket.findById(data.id)
  
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
});

it('acks the message', async () => {
  // 4. call the `onMessage` function with the data object + message object
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg);
  // 5. assert to make sure the ticket was created
  expect(msg.ack).toHaveBeenCalled();
});


