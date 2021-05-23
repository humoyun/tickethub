
import { StanPublisher, Subjects, OrderCreatedEvent } from "bay-common";

export class OrderCreatedPublisher extends StanPublisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}