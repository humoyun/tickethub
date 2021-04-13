import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Collection } from 'mongoose';
import app from '../src/app';
import request from 'supertest'

let mongodb: MongoMemoryServer;

declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string[]>;
    }
  }
}

beforeAll(async () => {
  // not a best option, but works
  process.env.JWT_KEY = 'some-very-secret-key';
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongodb = new MongoMemoryServer();
  const mongouri = await mongodb.getUri();

  await mongoose.connect(mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections() as Array<Collection>;
  for (let collection of collections) {
    await collection.deleteMany({});
  }
})

afterAll(async () => {
  await mongodb.stop();
  await mongoose.connection.close();
})

/**
 * global signin for only testing environment
 */
global.signup = async () => {
  const email = "test@test.com";
  const password = "password";

  const resp = await request(app).
    post('/api/users/signup').
    send({email, password}).
    expect(201);

  const cookie = resp.get('Set-Cookie');

  return cookie;
}