module.exports.JWT_SALT = 9;
module.exports.DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports.DB_DEV = 'mongodb://127.0.0.1:27017/bitfilmsdb';
module.exports.JWT_DEV = 'secret-key';

module.exports.regexURL = /(https?:\/\/)(www\.)?([a-zA-Z0-9-]{0,63}\.)([a-zA-Z]{2,4})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]#?)?/;
