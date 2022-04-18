const CustomError = require('./custom-error');

class NotFoundError extends CustomError {
  constructor() {
    super('Not found');
  }
  static getCode() {
    return 404;
  }
}

module.exports = NotFoundError;
