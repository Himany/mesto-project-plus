import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OK, CREATED } from '../utils/status-code';
import CreateError from '../error/error';
import User from '../models/user';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.status(OK).send({ data: users }))
  .catch(next);

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      ...req.body,
      password: hash,
    }))
    .then((user) => res.status(CREATED).send({
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    }))
    .catch((error) => {
      if (error.code === 11000) {
        next(CreateError.conflict('Пользователь с таким email уже существует'));
      } else if (error.name === 'ValidationError') {
        next(CreateError.badRequest('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'super-strong-secret',
        { expiresIn: '7d' },
      );

      res.status(OK).cookie('token', token, {
        expires: new Date(Date.now() + 168 * 3600000),
        httpOnly: true,
      }).send();
    })
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

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user._id;

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
          next(CreateError.badRequest('Передан некорректный идентификатор'));
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
          next(CreateError.badRequest('Передан некорректный идентификатор'));
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
        default:
          next(error);
      }
    });
};
