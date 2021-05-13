const UserService = require('../services/user.service');
const constants = require('../lib/constants');

const { info } = require('../lib/utils');

exports.signUp = async (req, res, next) => {
  const isValid = req.app.validator.user.signUp(req.body);

  // If request is invalid or incomplete respond with client error
  if (!isValid) {
    const err = {
      errors: req.app.validator.user.signUp.errors,
      code: constants.errorCodes.UE
    };

    return next(err);
  }

  try {
    info('Creating new user');

    const user = await UserService.createUser(req.body);

    info(user);

    return res.status(201).json({ user });
  } catch (err) {
    const message = 'E-mail taken';
    next({ errors: err, code: constants.errorCodes.BR, message });
  }
};

exports.login = async (req, res, next) => {
  const isValid = req.app.validator.user.logIn(req.body);

  // If request is invalid or incomplete respond with client error
  if (!isValid) {
    const err = {
      errors: req.app.validator.user.logIn.errors,
      code: constants.errorCodes.UE
    };

    return next(err);
  }

  try {
    if (req.session.user) {
      info('User is already logged in');
      return res.status(200).json({ user: req.session.user });
    }

    info('Logging user in');
    const user = await UserService.findUser(req.body);
    info(user);

    const { firstName, lastName, email } = user;

    req.session.user = { firstName, lastName, email };

    return res.status(200).json({ user: req.session.user });
  } catch (err) {
    next({ errors: err.message || err, code: constants.errorCodes.NA });
  }
};

exports.logout = (req, res, next) => {
  if (req.session.user) {
    // Clear user from session
    req.sessionStore.destroy(req.sessionID);
    delete req.sessionID;
    delete req.session.user;

    return res.status(200).json({ status: 'Success' });
  }

  return next({ errors: 'Not logged in', code: constants.errorCodes.BR });
};
