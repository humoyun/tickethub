import request from 'supertest';
import app from '../../app';

const timeout = 2000;

it('it responds with user info after signup/signin', async () => {
  const cookie = await global.signup();

  const resp = await request(app)
    .get('/api/users/me')
    .set('Cookie', cookie)
    .send()
    .expect(200)

  expect(resp.body.me.email).toEqual("test@test.com");
  
}, timeout);


it('it responds with null if not authenticated', async () => {
  const resp = await request(app)
    .get('/api/users/me')
    .send()
    .expect(200);

  expect(resp.body.me).toEqual(null);
})