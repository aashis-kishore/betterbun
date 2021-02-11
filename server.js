const mongoose = require('mongoose');
const colors = require('colors');
const app = require('./app');

const listener = app.listen(process.env.PORT || 3000, () => {
  console.info('Listening on port ' + listener.address().port);
  // Inform pm2 that the app is ready to be served
  if (process.send) {
    process.send('ready');
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  // Clear everything needed.
  listener.close(() => {
    // Close connection to db.
    mongoose.connection
      .close(true)
      .then(() => {
        console.info('Disposing server, bye');
        process.exit(0);
      }).catch(err => {
        console.error(colors.red(`Failed to close connection to db: ${err}`));

        console.info('Disposing server, bye');
        process.exit(1);
      });
  });
});
