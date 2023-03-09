require('dotenv').config();
const jwt = require('jsonwebtoken');

const { JWT_KEY, NODE_ENV } = process.env;

const { authError } = require('../utils/errors/AccountError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) return next(authError);

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, (NODE_ENV === 'production' ? JWT_KEY : 'secret-key'));
  } catch (err) {
    return next(authError);
  }

  // req.user = { ._id = ... }
  req.user = payload;

  return next();
};
