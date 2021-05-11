import request from 'supertest'
import app from '../../app'

const _randString = (n = 10) => Math.random().toString(36).slice(2, n) 

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: `ticket-${_randString}`,
      price: 22
    }).expect(201)
}

it('can fetch a list of tickets', async () => {
  await createTicket()
  await createTicket()
  await createTicket()

  const resp = await request(app)
    .get(`/api/tickets`)
    .send()
    .expect(200)
  
  expect(resp.body.length).toEqual(3)
})
