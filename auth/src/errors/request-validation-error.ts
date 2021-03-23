import { ValidationError } from "express-validator";
import BaseError from './base-error';

class RequestValidationError extends BaseError {
  statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super("request validation error");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(error => ({
      message: error.msg,
      field: error.param,
    }));
  }
}

export default RequestValidationError;