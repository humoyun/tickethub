import BaseError from './base-error';

class AuthError extends BaseError {
  statusCode = 403;

  constructor(private error: String) {
    super("authentication error");

    // only because we are extending a built in class
    Object.setPrototypeOf(this, AuthError.prototype);
  }

  serializeErrors() {
    return [

    ]
  }
}

export default AuthError;