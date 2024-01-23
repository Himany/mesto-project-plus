import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { isCelebrateError } from 'celebrate';
import CreateError from './error/error';
import router from './routes/router';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).user = {
    _id: '65afc12ca2376b061893137c', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(router);

app.use((err: CreateError, req: Request, res: Response, next: NextFunction) => {
  let { statusCode = 500, message } = err;

  if (isCelebrateError(err)) {
    statusCode = 400;
    message = 'Переданы некорректные данные';
  }

  res.status(statusCode).send({ message: (statusCode === 500) ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  console.log(`SERVER WORKED ON 127.0.0.1:${PORT};`);
});
