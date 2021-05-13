const validator = {};

module.exports = (ajv) => {
  const user = require('./schemas/user.schema');

  validator.userSignUp = ajv.compile(user.signUp);

  return validator;
};
