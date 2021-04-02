import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Collection } from 'mongoose';
import app from '../src/app';

let mongodb: MongoMemoryServer;

beforeAll(async () => {
  // not a best option, but works
  process.env.JWT_KEY = 'some-very-secret-key'; 

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