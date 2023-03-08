const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors, Joi, celebrate } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { notFoundError } = require('./utils/NotFoundError');
const { login, signup } = require('./controllers/users');
const auth = require('./middlewares/auth');
const responseErrors = require('./routes/responseErrors');

const { PORT = 3000 } = process.env;

const allowedCors = [
  'https://51.250.27.116:3000',
  '*',
];
const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

const app = express();
app.use(cookieParser());

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// позже будет убрано в пользу авторизации и передаче токена в headers через фронт часть
app.use((req, res, next) => {
  req.headers = {
    authorization: `Bearer ${req.cookies.token}`,
  };

  return next();
});

app.use(cors(corsOptions));

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), signup);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use((req, res) => {
  res.status(notFoundError.statusCode).send({ message: notFoundError.message });
});

app.use(errorLogger);
app.use(errors());
app.use(responseErrors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
