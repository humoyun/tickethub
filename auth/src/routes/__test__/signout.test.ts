import request from 'supertest';
import app from '../../app';

const timeout = 2000;

it('returns a 200 on successful signout with empty object {}', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  const resp = await request(app)
    .post('/api/users/signout')
    .expect(200);
  
  expect(resp.get('Set-Cookie')[0]).toEqual('jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
}, timeout);

