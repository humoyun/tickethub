import request from 'supertest'
import mongoose from 'mongoose'
import app from '../../app'
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', global.signin())
    .send({
      title: "Good ticket",
      price: 234,
    })
  .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .send({
      title: "Good ticket",
      price: 234,
    })
    .expect(401)
})

it('returns a 401 if the user is not the owner of the ticket', async () => {
  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin()) // provides every time diff user
    .send({
      title: 'some ticket',
      price: 213
    }).expect(201)
  
  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', global.signin()) // diff user because signin() returns rand user id every time
    .send({
      title: 'updated ticket X',
      price: 777
    }).expect(401)
})

it('returns a 400 if the provided inputs are invalid', async () => {
  const cookie = global.signin();
  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'some ticket',
      price: 213
    }).expect(201)
  
  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', cookie) // same user
    .send({
      title: '',
      price: 777
    }).expect(400)
  
  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', cookie) // same user
    .send({
      title: 'Valid',
      price: -200
    }).expect(400)
})

it('returns 204 updated if everything is ok', async () => {
  const cookie = global.signin();
  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'some ticket',
      price: 213
    }).expect(201)
  
  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', cookie) // same user
    .send({
      title: 'edited ticket ii',
      price: 777
    }).expect(204)
  
  const updatedTicket = await request(app)
    .get(`/api/tickets/${resp.body.id}`)
    .send()
  
  expect(updatedTicket.body.title).toEqual('edited ticket ii')
  expect(updatedTicket.body.price).toEqual(777)
})


it('it publishes an event', async () => {
  const cookie = global.signin();
  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'some ticket',
      price: 213
    }).expect(201);
  
  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', cookie) // same user
    .send({
      title: 'edited ticket ii',
      price: 777
    }).expect(204)
  
  // main thing to check
  expect(natsWrapper.client.publish).toHaveBeenCalled()
});

// important business logic
it('cannot edit already reserved tickets', async () => {
  const cookie = global.signin();
  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'some ticket',
      price: 213
    }).expect(201);
  
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = await Ticket.findById(resp.body.id);
  ticket!.set({ orderId });

  await ticket!.save();
  
  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', cookie) // same user
    .send({
      title: 'edited ticket',
      price: 121
    }).expect(400)
  
});