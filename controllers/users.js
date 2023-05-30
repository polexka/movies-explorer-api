require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_KEY, NODE_ENV } = process.env;
const { JWT_SALT, JWT_DEV } = require('../utils/constants');
const { getUserError } = require('../utils/errors/NotFoundError');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) return Promise.reject(getUserError);
      return res.send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) return Promise.reject(getUserError);
      return res.send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_KEY : JWT_DEV,
        { expiresIn: '7d' },
      );

      res.cookie('token', token, { httpOnly: true, sameSite: true });

      return res.send({ token });
    })
    .catch(next);
};

module.exports.signup = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, JWT_SALT)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_KEY : JWT_DEV,
        { expiresIn: '7d' },
      );

      res.cookie('token', token, { httpOnly: true, sameSite: true });

      return res.send({ token });
    })
    .catch(next);
};

module.exports.signout = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) return Promise.reject(getUserError);
      res.clearCookie('token');
      return res.send(user);
    })
    .catch(next);
};
