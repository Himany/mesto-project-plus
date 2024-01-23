import { Request, Response, NextFunction } from 'express';
import { OK, CREATED } from '../utils/status-code';
import CreateError from '../error/error';
import User from '../models/user';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.status(OK).send({ data: users }))
  .catch(next);

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((error) => {
      switch (error.name) {
        case 'ValidationError':
          next(CreateError.badRequest('Переданы некорректные данные'));
          break;
        default:
          next(error);
      }
    });
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw CreateError.notFound('Пользователь по указанному _id не найден');
      }
      res.status(OK).send({ data: user });
    })
    .catch((error) => {
      switch (error.name) {
        case 'CastError':
          next(CreateError.notFound('Пользователь по указанному _id не найден'));
          break;
        default:
          next(error);
      }
    });
};

export const updateUserData = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user._id;

  const { name, about } = req.body;
  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw CreateError.notFound('Пользователь по указанному _id не найден');
      }
      res.status(OK).send({ data: user });
    })
    .catch((error) => {
      switch (error.name) {
        case 'ValidationError':
          next(CreateError.badRequest('Переданы некорректные данные'));
          break;
        case 'CastError':
          next(CreateError.notFound('Пользователь по указанному _id не найден'));
          break;
        default:
          next(error);
      }
    });
};

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user._id;

  const { avatar } = req.body;
  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw CreateError.notFound('Пользователь по указанному _id не найден');
      }
      res.status(OK).send({ data: user });
    })
    .catch((error) => {
      switch (error.name) {
        case 'ValidationError':
          next(CreateError.badRequest('Переданы некорректные данные'));
          break;
        case 'CastError':
          next(CreateError.notFound('Пользователь по указанному _id не найден'));
          break;
        default:
          next(error);
      }
    });
};
