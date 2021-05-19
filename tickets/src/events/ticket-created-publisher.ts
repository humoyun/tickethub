import { StanPublisher, Subjects, TicketCreatedEvent } from "bay-common";

export class TicketCreatedPublisher extends StanPublisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}