import BaseError from './base-error';

class NotFoundError extends BaseError {
  statusCode = 404;
  reason = "Route not found";

  constructor() {
    super("Route not found");

    // only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}

export default NotFoundError;