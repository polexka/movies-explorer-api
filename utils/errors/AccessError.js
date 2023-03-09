class AccessError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Forbidden';
    this.statusCode = 403;
  }
}

module.exports.accessError = new AccessError('Нельзя удалить чужую публикацию.');
