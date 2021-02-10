// Returns 'DB_URI' if defined or tries to build and return
// a URI from given credentials
exports.getDbUri = (config) => {
  let dbUri = '';

  if (config.DB_URI) {
    dbUri = config.DB_URI;
  } else {
    if (config.DB_SCHEME && config.DB_HOST) {
      dbUri += `${config.DB_SCHEME}://`;

      if (config.DB_USER && config.DB_PASSWORD) {
        dbUri += `${config.DB_USER}:${config.DB_PASSWORD}@`;
      }

      dbUri += config.DB_HOST;
      dbUri += config.DB_PORT ? `:${config.DB_PORT}` : '';
      if (process.env.NODE_ENV === 'production') {
        if (config.DB_PROD_NAME) {
          dbUri += `/${config.DB_PROD_NAME}`;

          if (config.DB_PARAMS) {
            dbUri += `?${config.DB_PARAMS}`;
          }
        }
      } else {
        if (config.DB_TEST_NAME) {
          dbUri += `/${config.DB_TEST_NAME}`;

          if (config.DB_PARAMS) {
            dbUri += `?${config.DB_PARAMS}`;
          }
        }
      }
    } else {
      console.warn('\'DB_SCHEME\' or \'DB_HOST\' or both are not defined');

      dbUri = '';
    }
  }

  console.debug(`DB_URI: ${dbUri}`);

  return dbUri;
};
