import { OrderCreatedEvent, OrderStatus } from 'bay-common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from './../../nats-wrapper';
import { Ticket } from '../../models/ticket';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client); // mocked client

  const ticket = Ticket.build({
    title: "meet-up ticket",
    price: 347,
    userId: "some-user-id",
  });
  await ticket.save()
  // fake date
  const expiration = "30-05-2021";

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };
  // @ts-ignore, typescript issue :)
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg }
}

it('sets the orderId of the ticket after order was created for this ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  // sets orderId into the ticket
  await listener.onMessage(data, msg);

  // fetch latest version of the ticket
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id)
});

it('acks the message successfully', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled()
})

it('checks publishing ticket-updated event', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled()
  // (natsWrapper.client.publish as Jest.Mock).mock.calls, publish is mocked by jest
});