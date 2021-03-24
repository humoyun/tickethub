import BaseError from './base-error';

class UnauthorizedError extends BaseError {
  statusCode = 401;
  reason = "Not authorized";

  constructor() {
    super("Not authorized");

    // only because we are extending a built in class
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}

export default UnauthorizedError;