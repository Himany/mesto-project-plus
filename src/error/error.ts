import {
  BADREQUEST, UNAUTHORIZED, FORBIDDEN, NOTFOUND, CONFLICT,
} from '../utils/status-code';

export default class CreateError extends Error {
  statusCode: number;

  constructor(code: number, message: string) {
    super(message);
    this.statusCode = code;
  }

  static badRequest(message: string) {
    return new this(BADREQUEST, message);
  }

  static unauthorized(message: string) {
    return new this(UNAUTHORIZED, message);
  }

  static forbidden(message: string) {
    return new this(FORBIDDEN, message);
  }

  static notFound(message: string) {
    return new this(NOTFOUND, message);
  }

  static conflict(message: string) {
    return new this(CONFLICT, message);
  }
}
