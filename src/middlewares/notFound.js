const constants = require('../lib/constants');

module.exports = (req, res, next) => {
  const err = {
    errors: [{ message: constants.errorCodes.RNF.description }],
    code: constants.errorCodes.RNF
  };

  next(err);
};
