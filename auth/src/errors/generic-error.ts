import BaseError from './base-error';

class GenericError extends BaseError {
  statusCode = 400;
  reason = "Something went wrong";

  constructor(private error: String) {
    super("Something went wrong");

    // only because we are extending a built in class
    Object.setPrototypeOf(this, GenericError.prototype);
  }

  serializeErrors() {
    return []
  }
}

export default GenericError;