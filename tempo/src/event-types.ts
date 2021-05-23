import { Subjects } from './subjects';

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  }
}

export interface OrderCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    userId: string;
    ticketId: string;
  }
}