
import { StanPublisher, Subjects, PaymentCreatedEvent } from "bay-common";

export class PaymentCreatedPublisher extends StanPublisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}