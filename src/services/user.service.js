const User = require('../models/user.model');

exports.createUser = (userData) => new Promise((resolve, reject) => {
  const user = new User({ ...userData });

  user.save((err, user) => {
    if (err) {
      console.log('Failed to create to user: ', err);
      return reject(err);
    }

    return resolve(user);
  });
});

exports.findUser = (userData) => new Promise((resolve, reject) => {
  User.findOne({ email: userData.email }).exec((err, user) => {
    if (err) {
      console.info('Failed to find user: ', err);
      return reject(err);
    }

    if (!user) {
      return reject(new Error('No users of given E-mail Id found'));
    }

    console.log('User is: ', user);

    if (!user.comparePassword(userData.password)) {
      return reject(new Error('Wrong password'));
    }

    return resolve(user);
  });
});
