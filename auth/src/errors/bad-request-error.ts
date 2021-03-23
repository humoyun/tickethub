import BaseError from './base-error';

class BadRequestError extends BaseError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    // only because we are extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [
      { message: this.message }
    ]
  }
}

export default BadRequestError;