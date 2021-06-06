import mongoose from 'mongoose';
import app from './app'

const PORT = 3000;

const start = async () => {
  console.log('starting...')
  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined');
  }

  // currently defined in env section of k8s manifest files (yaml)
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
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