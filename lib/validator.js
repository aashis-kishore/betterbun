const validator = {};

module.exports = (ajv) => {
  const userSignUp = require('./schemas/user.signup');

  validator.userSignUp = ajv.compile(userSignUp);

  return validator;
};
