import request from 'supertest';
import app from '../../app';

const timeout = 2000;

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

}, timeout);


it('it returns a 400 bad request with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: "twestdwq@test",
      password: "password"
    })
    .expect(400)
}, timeout);


it('it returns a 400 bad request with missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      password: "password"
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com"
    })
    .expect(400)
}, timeout);


it('it disallows signup with duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201);

    await request(app)
      .post('/api/users/signup')
      .send({
        email: "test@test.com",
        password: "password"
      })
      .expect(400);

}, timeout);
