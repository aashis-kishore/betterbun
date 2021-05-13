const validator = {};

module.exports = (ajv) => {
  const userSignUp = require('./schemas/userSignUp.schema');

  validator.userSignUp = ajv.compile(userSignUp);

  return validator;
};
