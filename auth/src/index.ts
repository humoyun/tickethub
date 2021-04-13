import mongoose from 'mongoose';
import app from './app'

const PORT = 4001;
// defined in kubernetes config files
const MONGODB_URL = 'mongodb://auth-mongo-srv:27017/auth';

const start = async () => {
  // TODO where defined
  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined');
  }
  
  try {
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('*** auth connected to mongodb ***')
  } catch (err) {
    console.error('mongodb conn err: ', err)  
  }

  app.listen(PORT, () => {
    console.log(`auth service started on ${PORT}!`)
  })
}

start();