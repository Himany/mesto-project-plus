import express from 'express';
import mongoose from 'mongoose';
import router from './routes/router';
import error from './middlewares/errors';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(error);

app.listen(PORT, () => {
  console.log(`SERVER WORKED ON 127.0.0.1:${PORT};`);
});
