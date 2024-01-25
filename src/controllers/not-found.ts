import { NextFunction, Request, Response } from 'express';
import CreateError from '../error/error';

// eslint-disable-next-line import/prefer-default-export
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(CreateError.notFound('Неизвестный маршрут'));
};
