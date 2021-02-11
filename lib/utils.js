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
      console.warn('\'dbScheme\' or \'dbHost\' or both are not defined');

      dbUri = '';
    }
  }

  console.debug(`dbUri: ${dbUri}`);

  return dbUri;
};
