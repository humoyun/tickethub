import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Order from '../../models/order';
import Ticket from '../../models/ticket'; 
import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus } from 'bay-common';

it('it returns error if ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();
  const cookie = global.signin();
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId
    }).expect(404)
});

it('returns error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'cmeetuip',
    price: 200
  });

  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'some-test-user-id',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });

  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400)
});

it('successfully reserves the ticket', async () => {
  const ticket = Ticket.build({
    title: 'cmeetuip',
    price: 200
  });

  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

});

it('it publishes an order created event', async () => {
  const ticket = Ticket.build({
    title: 'cmeetuip',
    price: 200
  });
  await ticket.save();
  
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin()) // same user
    .send({ ticketId: ticket.id })
    .expect(201);
  
  // main thing to check
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})