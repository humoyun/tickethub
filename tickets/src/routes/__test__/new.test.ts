import request from 'supertest'
import app from '../../app'
import { Ticket } from '../../models/ticket'


it('has a route handler listening to /api/tickets for post requests', async () => {
  const resp = await request(app)
    .post('/api/tickets')
    .send({})
  
  expect(resp.status).not.toEqual(404)
}, 2000);

it('not authorized users cannot access this route', () => {
  request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
}, 2000);

it('only authorized users can access this route', async () => {
  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})

  expect(resp.status).not.toEqual(401);
}, 2000);

it('returns error in case of invalid title', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 100
    })
    .expect(400) // bad request
  
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 100
    })
  .expect(400) // bad request
}, 2000);

it('returns error in case of invalid price', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Ticket 1',
      price: -10
    })
    .expect(400) // bad request
  
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Ticket 1',
    })
    .expect(400) // bad request
}, 2000);

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Ticket super',
      price: 42
    })
    .expect(201);
  
  tickets = await Ticket.find({});
  
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(42);
}, 2000);

