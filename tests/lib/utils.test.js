const { getConfig } = require('../../src/lib/config');
const { getDbUri } = require('../../src/lib/utils');

describe('getDbUri', () => {
  let config;
  beforeAll(() => {
    config = getConfig();
  });

  test('should return \'dbUri\'', () => {
    // Save original dbUri
    const backupConfig = { ...config };

    const newDbUri = 'mongodb://localhost/betterbun-test';

    // Replace with test values
    config.dbUri = newDbUri;
    config.dbScheme = '';
    config.dbHost = '';

    expect(getDbUri(config)).toMatch(newDbUri);

    // Restore original dbUri
    config = backupConfig;
  });

  test('should return falsy value', () => {
    // Save originals
    const backupConfig = { ...config };

    // Replace with test values
    config.dbUri = '';
    config.dbScheme = '';
    config.dbHost = '';

    expect(getDbUri(config)).toBeFalsy();

    // Restore original values
    config = backupConfig;
  });

  test('URI should contain \'dbScheme\' and \'dbHost\'', () => {
    // Save originals
    const backupConfig = { ...config };

    // Replace with test values
    config.dbUri = '';
    config.dbScheme = 'mongodb';
    config.dbHost = 'localhost';
    config.dbPort = undefined;
    config.dbTestName = '';

    expect(getDbUri(config)).toMatch('mongodb://localhost');

    // Restore original values
    config = backupConfig;
  });

  test('URI should contain \'dbPort\'', () => {
    // Save originals
    const backupConfig = { ...config };

    // Replace with test values
    config.dbUri = '';
    config.dbScheme = 'mongodb';
    config.dbHost = 'localhost';
    config.dbPort = 1234;
    config.dbTestName = '';

    expect(getDbUri(config)).toMatch('mongodb://localhost:1234');

    // Restore original values
    config = backupConfig;
  });

  test('URI should contain \'dbPort\' and \'dbTestName\'', () => {
    // Save originals
    const backupConfig = { ...config };

    // Replace with test values
    config.dbUri = '';
    config.dbScheme = 'mongodb';
    config.dbHost = 'localhost';
    config.dbPort = 1234;
    config.dbTestName = 'test';

    expect(getDbUri(config)).toMatch('mongodb://localhost:1234/test');

    // Restore original values
    config = backupConfig;
  });

  test('URI should not contain \'dbPort\' but \'dbTestName\'', () => {
    // Save originals
    const backupConfig = { ...config };

    // Replace with test values
    config.dbUri = '';
    config.dbScheme = 'mongodb';
    config.dbHost = 'localhost';
    config.dbPort = undefined;
    config.dbTestName = 'test';

    expect(getDbUri(config)).toMatch('mongodb://localhost/test');

    // Restore original values
    config = backupConfig;
  });

  test('URI should not contain \'dbUser\', as \'dbPassword\' is absent',
    () => {
    // Save originals
      const backupConfig = { ...config };

      // Replace with test values
      config.dbUri = '';
      config.dbUser = 'admin';
      config.dbPassword = '';
      config.dbScheme = 'mongodb';
      config.dbHost = 'localhost';
      config.dbPort = undefined;
      config.dbTestName = 'test';

      expect(getDbUri(config)).toMatch('mongodb://localhost/test');

      // Restore original values
      config = backupConfig;
    });

  test('URI should not contain \'dbPassword\', as \'dbUser\' is absent',
    () => {
    // Save originals
      const backupConfig = { ...config };

      // Replace with test values
      config.dbUri = '';
      config.dbUser = '';
      config.dbPassword = 'letmein123';
      config.dbScheme = 'mongodb';
      config.dbHost = 'localhost';
      config.dbPort = undefined;
      config.dbTestName = 'test';

      expect(getDbUri(config)).toMatch('mongodb://localhost/test');

      // Restore original values
      config = backupConfig;
    });

  test('URI should contain \'dbUser\' and \'dbPassword\'',
    () => {
    // Save originals
      const backupConfig = { ...config };

      // Replace with test values
      config.dbUri = '';
      config.dbUser = 'admin';
      config.dbPassword = 'letmein123';
      config.dbScheme = 'mongodb';
      config.dbHost = 'localhost';
      config.dbPort = undefined;
      config.dbTestName = 'test';

      const expectedUri = 'mongodb://admin:letmein123@localhost/test';

      expect(getDbUri(config)).toMatch(expectedUri);

      // Restore original values
      config = backupConfig;
    });

  test('URI should contain \'dbProdName\'', () => {
    // Save originals
    const backupConfig = { ...config };
    const nodeEnv = process.env.NODE_ENV;

    // Set NODE_ENV to production to use production db
    process.env.NODE_ENV = 'production';

    // Replace with test values
    config.dbUri = '';
    config.dbProdName = 'proddb';
    config.dbUser = 'admin';
    config.dbPassword = 'letmein123';
    config.dbScheme = 'mongodb';
    config.dbHost = 'localhost';
    config.dbPort = undefined;
    config.dbTestName = 'test';

    const expectedUri = 'mongodb://admin:letmein123@localhost/proddb';

    expect(getDbUri(config)).toMatch(expectedUri);

    // Restore original values
    config = backupConfig;
    process.env.NODE_ENV = nodeEnv;
  });

  test('URI should contain \'dbParams\' after \'dbTestName\'', () => {
    // Save originals
    const backupConfig = { ...config };

    // Replace with test values
    config.dbUri = '';
    config.dbUser = 'admin';
    config.dbPassword = 'letmein123';
    config.dbScheme = 'mongodb';
    config.dbHost = 'localhost';
    config.dbPort = undefined;
    config.dbTestName = 'test';
    config.dbParams = 'foo=one&bar=two';

    const expectedUri = 'mongodb://admin:letmein123@localhost/test' +
                        '?foo=one&bar=two';

    expect(getDbUri(config)).toMatch(expectedUri);

    // Restore original values
    config = backupConfig;
  });
});
