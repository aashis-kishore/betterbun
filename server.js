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
  console.info('Disposing server, bye');
  listener.close(() => process.exit(0));
});
