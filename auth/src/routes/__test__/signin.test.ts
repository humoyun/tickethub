import request from 'supertest';
import app from '../../app';

const timeout = 2000;

it('it fails when email that does not exist', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({ email: "test@test.com", password: "password" })
    .expect(400);

}, timeout);


it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "wrong-password"
    })
    .expect(400)
}, timeout);


it('it responds with cookie when correct credentials are supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201);

  const resp = await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(200);
  console.log('resp', resp)
  expect(resp.get('Set-Cookie')).toBeDefined();

}, timeout);
