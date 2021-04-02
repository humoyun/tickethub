import request from 'supertest';
import app from '../../app';

const timeout = 2000;

/**
 * 1
 */
it('it responds with user info after signup/signin', async () => {
  const resp = await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201);

  const cookie = resp.get('Set-Cookie')
  const resp2 = await request(app)
    .post('/api/users/signin')
    .set('Cookie', cookie)
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(200);
  console.log('[current-user] resp2: ', resp2.get('Set-Cookie'))
  expect(resp2.body.currentUser.email).toEqual("test@test.com");

}, timeout);
