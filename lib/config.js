const fs = require('fs');
const path = require('path');
const _ = require('lodash');

// Load configurations from settings.json and env.yaml(if exists)
exports.getConfig = () => {
  let config = JSON.parse(fs.readFileSync(path.join(
    __dirname,
    '../config',
    'settings.json'
  ), 'utf8'));

  // Path to local config file and merge with base settings
  const localConfigFilePath = path.join(
    __dirname,
    '../config',
    'settingsLocal.json'
  );

  // Check for local config file and merge with base settings
  if (fs.existsSync(localConfigFilePath)) {
    const localConfigFile = JSON.parse(fs.readFileSync(
      localConfigFilePath,
      'utf8')
    );
    config = Object.assign(config, localConfigFile);
  }

  // Override from env.yaml environment file
  Object.keys(config).forEach((configKey) => {
    if (process.env[configKey]) {
      config[configKey] = process.env[configKey];
    }
  });

  return config;
};

exports.updateConfig = (fields) => {
  const settingsFile = this.getConfig();

  _.forEach(fields, (value, key) => {
    settingsFile[key] = value;
  });

  // If we have a local settings file (not git tracked) we loop its
  // settings and save any changes made to them. All other settings
  // get updated to the base settings file.
  const localSettingsFile = path.join(
    __dirname,
    '..config',
    'settingsLocal.json'
  );

  if (fs.existsSync(localSettingsFile)) {
    const localSettings = JSON.parse(fs.readFileSync(localSettingsFile));
    _.forEach(localSettings, (value, key) => {
      if (fields[key]) {
        localSettings[key] = fields[key];

        // Exists in local so remove from main settings file
        delete settingsFile[key];
      }
    });

    // Save our local settings
    try {
      fs.writeFileSync(localSettingsFile, JSON.stringify(
        localSettings,
        null,
        4
      ));
    } catch (e) {
      console.info('Failed to save local settings file', e);
    }
  }

  // Write base settings file
  const baseSettingsFile = path.join(
    __dirname,
    '../config',
    'settings.json'
  );

  try {
    fs.writeFileSync(baseSettingsFile, JSON.stringify(
      settingsFile,
      null,
      4
    ));
    return true;
  } catch (err) {
    return false;
  }
};

exports.updateConfigLocal = (field) => {
  const localSettingsFile = path.join(
    __dirname,
    '../config',
    'settingsLocal.json'
  );

  try {
    let localSettings = {};
    if (fs.existsSync(localSettingsFile)) {
      localSettings = JSON.parse(fs.readFileSync(localSettingsFile));
    }

    Object.assign(localSettings, field);
    fs.writeFileSync(localSettingsFile, JSON.stringify(
      localSettings,
      null,
      4
    ));
  } catch (err) {
    console.info('Failed to save local settings file: ', err);
  }
};
