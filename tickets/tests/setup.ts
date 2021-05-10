import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Collection } from 'mongoose';
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../src/app';

let mongodb: MongoMemoryServer;

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
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
 * global signup for only testing environment
 */
global.signin = () => {
  const payload = {
    email: "test@test.com",
    password: "password",
    id: "test-user-id"
  }

  const token = jwt.sign(payload, process.env.JWT_KEY as string)
  const jwtToken = {jwt: token};
  const sessionJSON = JSON.stringify(jwtToken);
  const base64EncodedCookie = Buffer.from(sessionJSON).toString('base64')

  // return as array of string because of supertest
  return [`jwt=${base64EncodedCookie}`];
}