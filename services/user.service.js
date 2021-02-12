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
