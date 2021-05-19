// import { TicketCreatedPublisher } from './ticket-created-publisher';
import nats from 'node-nats-streaming'

const stanClient = nats.connect('ticketing', 'publisher-1', {
  url: "http://localhost:4222"
});

stanClient.on('connect', async () => {
  console.log('stan client connected to NATS')

  // const publisher = new TicketCreatedPublisher(stanClient);
  // await publisher.publish({
  //   id: 'some id',
  //   title: 'some text',
  //   price: 202
  // })
});
