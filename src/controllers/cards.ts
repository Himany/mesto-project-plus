import { NextFunction, Request, Response } from 'express';
import { OK, CREATED } from '../utils/status-code';
import CreateError from '../error/error';
import Card from '../models/card';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.status(OK).send({ data: cards }))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const userId = (req as any).user._id;

  return Card.create({ name, link, owner: userId })
    .then((card) => res.status(CREATED).send({ data: card }))
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

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = (req as any).user._id;

  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(CreateError.notFound('Карточка с указанным _id не найдена'));
      }
      if (card.owner.toString() !== userId) {
        return Promise.reject(CreateError.forbidden('Удаление чужой карточки недоступно'));
      }

      return Card.findByIdAndDelete(cardId);
    })
    .then((card) => {
      res.status(OK).send({ data: card });
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

export const addLikeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = (req as any).user._id;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw CreateError.notFound('Карточка с указанным _id не найдена');
      }
      res.status(OK).send({ data: card });
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

export const deleteLikeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = (req as any).user._id;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw CreateError.notFound('Карточка с указанным _id не найдена');
      }
      res.status(OK).send({ data: card });
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
