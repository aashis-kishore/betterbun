const { getConfig } = require('../../lib/config');
const { getDbUri } = require('../../lib/utils');

describe('getDbUri', () => {
  let config;
  beforeAll(() => {
    config = getConfig();
  });

  test('should return \'DB_URI\'', () => {
    // Save original DB_URI
    const backupConfig = { ...config };

    const newDbUri = 'mongodb://localhost/betterbun-test';

    // Replace with test values
    config.DB_URI = newDbUri;
    config.DB_SCHEME = '';
    config.DB_HOST = '';

    expect(getDbUri(config)).toMatch(newDbUri);

    // Restore original DB_URI
    config = backupConfig;
  });

  test('should return falsy value', () => {
    // Save originals
    const backupConfig = { ...config };

    // Replace with test values
    config.DB_URI = '';
    config.DB_SCHEME = '';
    config.DB_HOST = '';

    expect(getDbUri(config)).toBeFalsy();

    // Restore original values
    config = backupConfig;
  });

  test('URI should contain \'DB_SCHEME\' and \'DB_HOST\'', () => {
    // Save originals
    const backupConfig = { ...config };

    // Replace with test values
    config.DB_URI = '';
    config.DB_SCHEME = 'mongodb';
    config.DB_HOST = 'localhost';
    config.DB_PORT = undefined;
    config.DB_TEST_NAME = '';

    expect(getDbUri(config)).toMatch('mongodb://localhost');

    // Restore original values
    config = backupConfig;
  });

  test('URI should contain \'DB_PORT\'', () => {
    // Save originals
    const backupConfig = { ...config };

    // Replace with test values
    config.DB_URI = '';
    config.DB_SCHEME = 'mongodb';
    config.DB_HOST = 'localhost';
    config.DB_PORT = 1234;
    config.DB_TEST_NAME = '';

    expect(getDbUri(config)).toMatch('mongodb://localhost:1234');

    // Restore original values
    config = backupConfig;
  });

  test('URI should contain \'DB_PORT\' and \'DB_TEST_NAME\'', () => {
    // Save originals
    const backupConfig = { ...config };

    // Replace with test values
    config.DB_URI = '';
    config.DB_SCHEME = 'mongodb';
    config.DB_HOST = 'localhost';
    config.DB_PORT = 1234;
    config.DB_TEST_NAME = 'test';

    expect(getDbUri(config)).toMatch('mongodb://localhost:1234/test');

    // Restore original values
    config = backupConfig;
  });

  test('URI should not contain \'DB_PORT\' but \'DB_TEST_NAME\'', () => {
    // Save originals
    const backupConfig = { ...config };

    // Replace with test values
    config.DB_URI = '';
    config.DB_SCHEME = 'mongodb';
    config.DB_HOST = 'localhost';
    config.DB_PORT = undefined;
    config.DB_TEST_NAME = 'test';

    expect(getDbUri(config)).toMatch('mongodb://localhost/test');

    // Restore original values
    config = backupConfig;
  });

  test('URI should not contain \'DB_USER\', as \'DB_PASSWORD\' is absent',
    () => {
    // Save originals
      const backupConfig = { ...config };

      // Replace with test values
      config.DB_URI = '';
      config.DB_USER = 'admin';
      config.DB_PASSWORD = '';
      config.DB_SCHEME = 'mongodb';
      config.DB_HOST = 'localhost';
      config.DB_PORT = undefined;
      config.DB_TEST_NAME = 'test';

      expect(getDbUri(config)).toMatch('mongodb://localhost/test');

      // Restore original values
      config = backupConfig;
    });

  test('URI should not contain \'DB_PASSWORD\', as \'DB_USER\' is absent',
    () => {
    // Save originals
      const backupConfig = { ...config };

      // Replace with test values
      config.DB_URI = '';
      config.DB_USER = '';
      config.DB_PASSWORD = 'letmein123';
      config.DB_SCHEME = 'mongodb';
      config.DB_HOST = 'localhost';
      config.DB_PORT = undefined;
      config.DB_TEST_NAME = 'test';

      expect(getDbUri(config)).toMatch('mongodb://localhost/test');

      // Restore original values
      config = backupConfig;
    });

  test('URI should contain \'DB_USER\' and \'DB_PASSWORD\'',
    () => {
    // Save originals
      const backupConfig = { ...config };

      // Replace with test values
      config.DB_URI = '';
      config.DB_USER = 'admin';
      config.DB_PASSWORD = 'letmein123';
      config.DB_SCHEME = 'mongodb';
      config.DB_HOST = 'localhost';
      config.DB_PORT = undefined;
      config.DB_TEST_NAME = 'test';

      const expectedUri = 'mongodb://admin:letmein123@localhost/test';

      expect(getDbUri(config)).toMatch(expectedUri);

      // Restore original values
      config = backupConfig;
    });

  test('URI should contain \'DB_PROD_NAME\'', () => {
    // Save originals
    const backupConfig = { ...config };
    const nodeEnv = process.env.NODE_ENV;

    // Set NODE_ENV to production to use production db
    process.env.NODE_ENV = 'production';

    // Replace with test values
    config.DB_URI = '';
    config.DB_PROD_NAME = 'proddb';
    config.DB_USER = 'admin';
    config.DB_PASSWORD = 'letmein123';
    config.DB_SCHEME = 'mongodb';
    config.DB_HOST = 'localhost';
    config.DB_PORT = undefined;
    config.DB_TEST_NAME = 'test';

    const expectedUri = 'mongodb://admin:letmein123@localhost/proddb';

    expect(getDbUri(config)).toMatch(expectedUri);

    // Restore original values
    config = backupConfig;
    process.env.NODE_ENV = nodeEnv;
  });

  test('URI should contain \'DB_PARAMS\' after \'DB_TEST_NAME\'', () => {
    // Save originals
    const backupConfig = { ...config };

    // Replace with test values
    config.DB_URI = '';
    config.DB_USER = 'admin';
    config.DB_PASSWORD = 'letmein123';
    config.DB_SCHEME = 'mongodb';
    config.DB_HOST = 'localhost';
    config.DB_PORT = undefined;
    config.DB_TEST_NAME = 'test';
    config.DB_PARAMS = 'foo=one&bar=two';

    const expectedUri = 'mongodb://admin:letmein123@localhost/test' +
                        '?foo=one&bar=two';

    expect(getDbUri(config)).toMatch(expectedUri);

    // Restore original values
    config = backupConfig;
  });
});
