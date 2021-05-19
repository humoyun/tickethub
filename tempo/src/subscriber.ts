// import { TicketCreatedListener } from './ticket-created-listener';
import nats, { Message } from 'node-nats-streaming'
import {randomBytes} from 'crypto'

const stanClient = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: "http://localhost:4222"
})

stanClient.on('connect', () => {
  console.log('listener connected')

  stanClient.on('close', () => {
    console.warn('NATS connection closed!')
    process.exit();
  });
  
  // new TicketCreatedListener(stanClient).listen()
})