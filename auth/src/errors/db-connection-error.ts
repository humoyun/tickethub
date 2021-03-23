import BaseError from './base-error';

class DBConnectionError extends BaseError {
  statusCode = 500;
  reason = "DB connection error";

  constructor() {
    super("DB connection error");

    // only because we are extending a built in class
    Object.setPrototypeOf(this, DBConnectionError.prototype);
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}

export default DBConnectionError;