const { badRequestError } = require('../utils/BadRequest');
const { signupError } = require('../utils/SignupError');
const { validationError } = require('../utils/ValidationError');

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message = 'На сервере произошла ошибка.' } = err;

  if (err.name === 'CastError') {
    res.status(badRequestError.statusCode).send({ message: badRequestError.message });
  } else if (err.name === validationError.name) {
    res.status(validationError.statusCode).send({ message: err.message });
  } else if (err.code === 11000) {
    res.status(signupError.statusCode).send({ message: signupError.message });
  } else {
    res.status(statusCode).send({ message });
  }

  next();
};
