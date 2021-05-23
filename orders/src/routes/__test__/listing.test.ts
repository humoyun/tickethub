import request from 'supertest';
import app from '../../app';
import Ticket from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'some random title',
    price: 201
  })

  await ticket.save()

  return ticket
}

it('fetches orders for a particular user ', async () => {
  // create three tickets
  const ticketOne = await buildTicket()
  const ticketTwo = await buildTicket()
  const ticketThree = await buildTicket()

  const userOne = global.signin()
  const userTwo = global.signin()
  // create one order as user#1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)
  // create two order as user#2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201)
  const { body: orderTwo } =await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201)

  // make request to get orders for user#2
  const resp = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)
  
  expect(resp.body.length).toEqual(2);
  // correct order
  expect(resp.body[0].id).toEqual(orderOne.id);
  expect(resp.body[1].id).toEqual(orderTwo.id);
})