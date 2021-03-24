import BaseError from './base-error';

class RouteNotFoundError extends BaseError {
  statusCode = 404;
  reason = "Route not found";

  constructor() {
    super("Route not found");

    // only because we are extending a built in class
    Object.setPrototypeOf(this, RouteNotFoundError.prototype);
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}

export default RouteNotFoundError;