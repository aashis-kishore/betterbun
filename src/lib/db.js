const mongoose = require('mongoose');
const colors = require('colors');
const { info, error, warn } = require('../lib/utils');

let db;
// Connect to database
exports.initDb = async (dbUri) => {
  // If valid database object, return
  if (db) {
    warn(colors.yellow('Trying to init DB!'));

    return db;
  }

  db = mongoose.connection;

  if (process.env.NODE_ENV !== 'test') {
  // Set event handlers on db
    db.on('connecting', () => info('Connecting to DB'));
    db.on('connected', () => info('Connected to DB'));
    db.on('reconnected', () => info('Reconnected to DB'));
    db.on('error',
      () => warn(colors.yellow('Error on connecting to DB')
      ));
    db.on('disconnected',
      () => warn(colors.yellow('Disconnected from DB')
      ));
    db.on('close', () => info('Connection to DB closed'));

    try {
      await mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      });

      return db;
    } catch (err) {
      error(colors.red(`Something terrible happened: ${err}`));

      process.exit(2);
    }
  }
};
