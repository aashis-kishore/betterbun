const mongoose = require('mongoose');
const colors = require('colors');

let db;
// Connect to database
exports.initDb = async (dbUri) => {
  // If valid database object, return
  if (db) {
    console.warn(colors.yellow('Trying to init DB!'));
    return Promise.resolve(db);
  }

  db = mongoose.connection;

  // Set event handlers on db
  db.on('connecting', () => console.info('Connecting to DB'));
  db.on('connected', () => console.info('Connected to DB'));
  db.on('reconnected', () => console.info('Reconnected to DB'));
  db.on('error',
    () => console.warn(colors.yellow('Error on connecting to DB')
    ));
  db.on('disconnected',
    () => console.warn(colors.yellow('Disconnected from DB')
    ));
  db.on('close', () => console.info('Connection to DB closed'));

  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
    .catch((err) => {
      console.error(colors.red(`Something terrible happened: ${err}`));

      process.exit(2);
    });

  return Promise.resolve(db);
};
