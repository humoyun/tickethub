import { OrderCancelledEvent, OrderStatus } from 'bay-common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../nats-wrapper';
import Order from '../../models/order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client); // mocked client

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 323,
    status: OrderStatus.Created
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1, // !important, version is updated when order was cancelled
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    }
  };
  // @ts-ignore, typescript issue :)
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, order, msg }
}

it('updates the status of the order', async () => {
  const { listener, data, order, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled()
});