const user = require('./schemas/user.schema');

const loadUserSchema = (user, ajv) => {
  const logIn = ajv.compile(user.logIn);
  const signUp = ajv.compile(user.signUp);

  return { logIn, signUp };
};

module.exports = (ajv) => {
  const validator = {};

  validator.user = loadUserSchema(user, ajv);

  return validator;
};
