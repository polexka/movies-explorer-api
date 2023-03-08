const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { accountError } = require('../utils/AccountError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введен некорректный email',
    },
  },
}, {
  toObject: { useProjection: true },
  toJSON: { useProjection: true },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return Promise.reject(accountError);

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) return Promise.reject(accountError);

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
