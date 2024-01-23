import { Router } from 'express';
import usersRouter from './users';
import cardsRouter from './cards';
import { notFound } from '../controllers/not-found';

const router = Router();

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', notFound);

export default router;
