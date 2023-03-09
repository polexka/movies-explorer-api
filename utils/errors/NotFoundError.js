class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFound';
    this.statusCode = 404;
  }
}

module.exports.notFoundError = new NotFoundError('Страницы не существует!');
module.exports.createMovieError = new NotFoundError('Не удалось создать фильм.');
module.exports.deleteMovieError = new NotFoundError('Не удалось найти фильм с таким id.');
module.exports.getUserError = new NotFoundError('Не удалось получить данные пользователя.');
