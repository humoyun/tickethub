import mongoose from 'mongoose';
import app from './app'

const PORT = 4002;

const start = async () => {
  // JWT_KEY defined in kubernetes secret service
  // currently defined in env section of k8s manifest files (yaml)
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
    console.log('*** tickets connected to mongodb ***')
  } catch (err) {
    console.error('mongodb conn err: ', err)  
  }

  app.listen(PORT, () => {
    console.log(`tickets service started on ${PORT}!`)
  })
}

start();