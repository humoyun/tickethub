import { StanPublisher, Subjects, TicketUpdatedEvent } from "bay-common";

export class TicketUpdatedPublisher extends StanPublisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}