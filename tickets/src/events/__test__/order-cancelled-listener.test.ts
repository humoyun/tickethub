import { OrderCancelledEvent } from 'bay-common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from './../../nats-wrapper';
import { Ticket } from '../../models/ticket';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client); // mocked client
  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: "meet-up ticket",
    price: 347,
    userId: "some-user-id",
  });

  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    }
  };
  // @ts-ignore, typescript issue :)
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg }
}

// it would be better if we split this test into separate 3 tests, 
// but to save time and already did in other tests
it('updates a ticket, publishes an event and acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  // fetch latest version of the ticket
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined(); // should undefined
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
});