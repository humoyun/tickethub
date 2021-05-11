import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose'

// issue: https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id
// .get('/api/tickets/somewrongticketid') old version
it('returns 404 if the ticket is not found', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .get(`/api/tickets/${ticketId}`)
    .send()
    .expect(404)
})

it('returns the ticket if it is found', async () => {
  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: "Super ticket",
      price: 22
    }).expect(201)
  
  const ticketId = resp.body.id;
  const getResp = await request(app)
    .get(`/api/tickets/${ticketId}`)
    .send()
    .expect(200)
  
  expect(getResp.body.title).toEqual("Super ticket")
})