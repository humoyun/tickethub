import mongoose from 'mongoose';
import app from './app'

const PORT = 4001;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined');
  }
  
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
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