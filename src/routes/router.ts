import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import usersRouter from './users';
import cardsRouter from './cards';
import { notFound } from '../controllers/not-found';
import {
  createUser, login,
} from '../controllers/users';
import auth from '../middlewares/auth';

const router = Router();

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri(),
  }),
}), createUser);
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', notFound);

export default router;
