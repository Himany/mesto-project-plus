import { BADREQUEST, NOTFOUND } from '../utils/status-code';

export default class CreateError extends Error {
  statusCode: number;

  constructor(code: number, message: string) {
    super(message);
    this.statusCode = code;
  }

  static badRequest(message: string) {
    return new this(BADREQUEST, message);
  }

  static notFound(message: string) {
    return new this(NOTFOUND, message);
  }
}
