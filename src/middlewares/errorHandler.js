const colors = require('colors');
const { warn } = require('../lib/utils');
const constants = require('../lib/constants');

module.exports = (err, req, res, next) => {
  warn(colors.yellow(
    `${err.stack
      ? err.stack
      : require('util').inspect(err, { depth: null })}`
  ));

  const response = {
    status: 'FAILURE',
    errors: err.errors
  };

  if (!err.code) {
    err.code = constants.errorCodes.IE;

    if (err.statusCode) {
      err.code = { status: err.statusCode };
      response.errors = err.message;
    }
  }

  return res.status(err.code.status).json(response);
};
