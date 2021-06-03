import { OrderCreatedEvent, OrderStatus } from 'bay-common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from './../../nats-wrapper';
import Order from '../../models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client); // mocked client

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: '03-06-2021',
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id: "fake ticket",
      price: 4423
    }
  };
  
  // @ts-ignore, typescript issue :)
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }
}

it('replicates order info', async () => {
  const { listener,  data, msg } = await setup();

  // sets orderId into the ticket
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message successfully', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled()
});