import mongoose from 'mongoose';
import { TicketUpdatedListener } from './events/ticket-updated-listener';
import { TicketCreatedListener } from './events/ticket-created-listener';
import { natsWrapper } from './nats-wrapper';
import app from './app'


const PORT = 3000;

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

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  console.log('process.env.NATS_CLUSTER_ID', process.env.NATS_CLUSTER_ID)
  console.log('process.env.NATS_URL', process.env.NATS_URL)
  console.log('process.env.MONGO_URI', process.env.MONGO_URI)

  try {
    // NATS graceful shutdown
    // make NATSWrapper (Singleton) class for initializing NATS client similar to mongoose
    // because NATS client is returned from client.connect()
    // unlike mongoose.connect(),, mongoose takes care of init/conn and 
    // you can import mongoose anywhere and use without worrying

    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.warn('NATS connection closed!')
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())
    
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error('natsWrapper.connect', err) 
  }


  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('*** ORDER_SERVICE connected to mongodb ***')
  } catch (err) {
    console.error('mongodb conn err: ', err)  
  }

  app.listen(PORT, () => {
    console.log(`orders service started on ${PORT}!`)
  })
}

start();