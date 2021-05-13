const colors = require('colors');
const { warn } = require('../lib/utils');

module.exports = (err, req, res, next) => {
  warn(colors.yellow(
    `${err.stack
      ? err.stack
      : require('util').inspect(err, { depth: null })}`
  ));

  const response = {
    status: 'FAILURE'
  };

  // if (app.get('env') !== 'production') {
  response.errors = err.errors;
  // }

  return res.status(err.code.status || 500).json(response);
};
