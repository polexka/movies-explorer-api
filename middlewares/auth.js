require('dotenv').config();
const jwt = require('jsonwebtoken');

const { JWT_KEY, NODE_ENV } = process.env;

const { authError } = require('../utils/AccountError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) return res.status(authError.statusCode).send({ message: authError.message });

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, (NODE_ENV === 'production' ? JWT_KEY : 'secret-key'));
  } catch (err) {
    return res.status(authError.statusCode).send({ message: authError.message });
  }

  // сюда попадает { ._id = бла бла бла}
  req.user = payload;

  return next();
};
