require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const responseErrors = require('./middlewares/responseErrors');
const { DB_DEV } = require('./utils/constants');
const { limiter } = require('./utils/rateLimiter');

const { NODE_ENV, DB } = process.env;

const { PORT = 5000 } = process.env;

const allowedCors = [
  'https://84.201.175.61:3000',
  'https://localhost:3000',
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
mongoose.connect(NODE_ENV === 'production' ? DB : DB_DEV);
mongoose.connect(DB_DEV);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.headers = {
    authorization: `Bearer ${req.cookies.token}`,
  };

  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  return next();
});

app.use(cors(corsOptions));

app.use(requestLogger);
app.use(limiter);

app.use('/', require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(responseErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
