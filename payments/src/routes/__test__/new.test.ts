import mongoose from 'mongoose'
import request from 'supertest'
import { OrderStatus } from 'bay-common'
import app from '../../app'
import Order from '../../models/order'
import { stripe } from '../../stripe'


jest.mock('../../stripe')

it('returns 404 when purchasing an order that does not exist', async () => {
  const resp = await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: "fake-strip-token",
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
  
  expect(resp.status).toEqual(404)
}, 1000);

it('return 401 error when purchasing order that does not belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 23432,
    version: 0,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: "fake-strip-token",
      orderId: order.id,
    })
    .expect(401);
}, 2000);

it('returns 400 when purchasing cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userId); 
  
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    price: 23432,
    version: 0,
    status: OrderStatus.Cancelled
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: "fake-strip-token",
      orderId: order.id
    })
    .expect(400);
}, 2000);

it('returns 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userId);
  
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    price: 234,
    version: 0,
    status: OrderStatus.Created
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: "tok_visa",
      orderId: order.id
    })
    .expect(201);
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][1]
  
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(234);
  expect(chargeOptions.currency).toEqual('usd');
});

it.todo('check payment model')