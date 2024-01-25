import { Request, Response, NextFunction } from 'express';
import { isCelebrateError } from 'celebrate';
import CreateError from '../error/error';

// eslint-disable-next-line consistent-return, no-unused-vars
export default (err: CreateError, req: Request, res: Response, next: NextFunction) => {
  let { statusCode = 500, message } = err;

  if (isCelebrateError(err)) {
    statusCode = 400;
    message = 'Переданы некорректные данные';
  }

  res.status(statusCode).send({ message: (statusCode === 500) ? 'На сервере произошла ошибка' : message });
};
