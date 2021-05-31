import { OrderStatus } from 'bay-common';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import Order from '../../models/order';
import Ticket from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper'

it('delete the order successfully', async () => {
  const mockedId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id: mockedId,
    title: 'some random title',
    price: 201
  });

  await ticket.save();

  const user = global.signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user) 
    .send({
      ticketId: ticket.id
    })
    .expect(201)
  
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(204)
  
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('it publishes an order cancelled event', async () => {
  const user = global.signin();
  const mockedId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id: mockedId,
    title: 'some random title',
    price: 201
  });

  await ticket.save();
  
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user) // same user
    .send({ ticketId: ticket.id })
    .expect(201);
  
  
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user) // same user
    .send({ ticketId: ticket.id })
    .expect(204);
  
  // main thing to check
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})