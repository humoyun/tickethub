import { StanPublisher, Subjects, ExpirationCompleteEvent } from "bay-common";

export class ExpirationCompletePublisher extends StanPublisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}