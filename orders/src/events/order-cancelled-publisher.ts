import { StanPublisher, Subjects, OrderCancelledEvent } from "bay-common";

export class OrderCancelledPublisher extends StanPublisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}