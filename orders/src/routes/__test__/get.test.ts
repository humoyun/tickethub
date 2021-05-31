import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Ticket from '../../models/ticket';

it('fetches an order', async () => {
  const mockedId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id: mockedId,
    title: 'some random title',
    price: 201
  })

  await ticket.save()
  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id
    })
    .expect(201)

  const resp = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)
  
  expect(resp.body.id).toEqual(order.id)
});

it.todo('unauthorized error when user want to get the order which he does not own');