const UserService = require('../services/user.service');
const constants = require('../lib/constants');

exports.signUp = async (req, res, next) => {
  const isValid = req.app.validator.userSignUp(req.body);

  // If request is invalid or incomplete respond with client error
  if (!isValid) {
    const err = {
      errors: req.app.validator.userSignUp.errors,
      code: constants.errorCodes.UE
    };

    return next(err);
  }

  try {
    console.info('Creating new user');

    const user = await UserService.createUser(req.body);

    console.log(user);

    return res.status(201).json({ status: 'SUCCESS', user: user });
  } catch (err) {
    const message = 'E-mail taken';
    next({ errors: err, code: constants.errorCodes.BR, message });
  }
};

exports.login = async (req, res, next) => {
  try {
    if (req.session.user) {
      return res.status(200).json({ status: 'SUCCESS' });
    }

    console.info('Logging user in');
    const user = await UserService.findUser(req.body);
    console.log(user);

    const { firstName, lastName, email } = user;

    req.session.user = { firstName, lastName, email };

    return res.status(200).json({ status: 'SUCCESS' });
  } catch (err) {
    next({ errors: err.message || err, code: constants.errorCodes.NA });
  }
};
