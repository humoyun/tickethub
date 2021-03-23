import FieldError from './types';

export default abstract class BaseError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    // only because we are extending a built in class
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract serializeErrors(): Array<FieldError>
}