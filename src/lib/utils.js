const colors = require('colors');

// Returns 'DB_URI' if defined or tries to build and return
// a URI from given credentials
exports.getDbUri = (config) => {
  let dbUri = '';

  if (config.dbUri) {
    dbUri = config.dbUri;
  } else {
    if (config.dbScheme && config.dbHost) {
      dbUri += `${config.dbScheme}://`;

      if (config.dbUser && config.dbPassword) {
        dbUri += `${config.dbUser}:${config.dbPassword}@`;
      }

      dbUri += config.dbHost;
      dbUri += config.dbPort ? `:${config.dbPort}` : '';
      if (process.env.NODE_ENV === 'production') {
        if (config.dbProdName) {
          dbUri += `/${config.dbProdName}`;

          if (config.dbParams) {
            dbUri += `?${config.dbParams}`;
          }
        }
      } else {
        if (config.dbTestName) {
          dbUri += `/${config.dbTestName}`;

          if (config.dbParams) {
            dbUri += `?${config.dbParams}`;
          }
        }
      }
    } else {
      warn('\'dbScheme\' or \'dbHost\' or both are not defined');

      dbUri = '';
    }
  }

  debug(`dbUri: ${dbUri}`);

  return dbUri;
};

const log = (...args) => {
  if (process.env.NODE_ENV !== 'test' || process.env.DO_LOG) {
    console.log(colors.blue(...args));
  }
};

const info = (...args) => {
  if (process.env.NODE_ENV !== 'test' || process.env.DO_LOG) {
    console.info(...args);
  }
};

const debug = (...args) => {
  if (process.env.NODE_ENV !== 'test' || process.env.DO_LOG) {
    console.debug(colors.green(...args));
  }
};

const warn = (...args) => {
  if (process.env.NODE_ENV !== 'test' || process.env.DO_LOG) {
    console.warn(colors.yellow(...args));
  }
};

const error = (...args) => {
  if (process.env.NODE_ENV !== 'test' || process.env.DO_LOG) {
    console.error(colors.red(...args));
  }
};

exports.log = log;
exports.info = info;
exports.debug = debug;
exports.warn = warn;
exports.error = error;
