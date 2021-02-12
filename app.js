const express = require('express');
const colors = require('colors');
const fs = require('fs');
const crypto = require('crypto');
const yenv = require('yenv');
const Ajv = require('ajv').default;
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');

const { getConfig, updateConfigLocal } = require('./lib/config');
const { getDbUri } = require('./lib/utils');
const { initDb } = require('./lib/db');

// Routes
const userRoute = require('./routes/user.route');
const constants = require('./lib/constants');

// Load configuration from env file
const pathToEnvFile = 'env.yaml';
if (fs.existsSync(pathToEnvFile)) {
  console.info(`Loading env values from: ${pathToEnvFile}`);

  process.env = yenv(pathToEnvFile, { strict: false });
}

// For Validating settings(configurations)
const ajv = new Ajv({ useDefaults: true, allErrors: true });
// Add errors
require('ajv-errors')(ajv);
// Add additional ajv formats
require('ajv-formats')(ajv);

// Load configurations
const config = getConfig();

// Validate settings
console.info('Validating configurations against schema');
const configValid = ajv.validate(require('./config/settingsSchema'), config);
if (!configValid) {
  console.error(colors.red(`Invalid settings.json: ${ajv.errorsText()}`));

  process.exit(2);
}

// Betterbun is born
const app = express();

// For validating request params and others
app.validator = require('./lib/validator')(ajv);

// Initialize database
initDb(getDbUri(config))
  .then(db => {
    app.db = db;
    app.config = config;
  })
  .catch(err => {
    console.error(colors.red(`Error: ${err}`));

    process.exit(2);
  });

// Set environment as an attribute
app.set('env', process.env.NODE_ENV);

// Make PORT available to server
app.set('port', config.port);

// Create the session store
const store = new MongoStore({
  uri: getDbUri(config),
  collection: 'sessions'
});

// Setup secrets
if (!config.secretCookie || config.secretCookie === '') {
  const randomString = crypto.randomBytes(20).toString('hex');
  config.secretCookie = randomString;
  updateConfigLocal({ secretCookie: randomString });
}

if (!config.secretSession || config.secretSession === '') {
  const randomString = crypto.randomBytes(20).toString('hex');
  config.secretSession = randomString;
  updateConfigLocal({ secretSession: randomString });
}

app.use(cors());
// Protection against common vulnerabilities
app.use(helmet());
// Logger morgan
app.use(morgan('dev'));
// Compress responses
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
  }
}));

// Session object
const sess = {
  name: 'sessionId',
  resave: false,
  saveUninitialized: false,
  secret: config.secretSession,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hrs or 1 day
  },
  store: store
};

// Use routes
app.use('/api/user', userRoute);

// Choose secure cookie only in production
if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sess.cookie.secure = false; // should be true in producion
}

// Use session
app.use(session(sess));

// No caching while not on production
if (app.get('env') !== 'production') {
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store');
    next();
  });
}

// Test route, to be modified or removed.
app.get('/', (req, res) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }

  res.send('Hello, Things look good:' + req.session.views);
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = {
    errors: [{ message: constants.errorCodes.RNF.description }],
    code: constants.errorCodes.RNF
  };

  next(err);
});

// Handle routing errors
app.use((err, req, res, next) => {
  console.warn(colors.yellow(
    `${err.stack
      ? err.stack
      : require('util').inspect(err, { depth: null })}`
  ));

  const response = {
    status: 'FAILURE'
  };

  if (app.get('env') !== 'production') {
    response.errors = err.errors;
  }

  return res.status(err.code.status || 500).json(response);
});

module.exports = app;
