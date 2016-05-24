const assert = require('assert');
const fs = require('fs');
const nconf = require('nconf');


exports.make = (opts) => {
  const store = new nconf.Provider;
  const env = process.env.NODE_ENV || 'development';
  const configDir = process.env.NODE_CONFIG_DIR || opts.path || `${__dirname}/../../..`;
  const configFile = process.env.NODE_CONFIG_FILE;

  assert(fs.existsSync(configDir), `${configDir} does not seem to exist`);

  if (configFile) {
    assert(fs.existsSync(configFile), `${configFile} does not seem to exist`);
  }

  // This is just for backward compatibility with dotenv.
  // In fact, values loaded from .env files by dotenv are available
  // in nconf as well.
  require('dotenv').config({ silent: true, path: `${configDir}/.env` });

  /**
   * Setup configuration with nconf in the following order:
   *   1. Environment variables (process.env) with '__' as the separator
   *   2. Command line arguments (process.argv)
   *   3. Custom config (if provided)
   *   4. Environment specific config 'config.<env>.json'
   *   5. User-specified default values
   *   6. System defaults
   */
  store.env('__')
    .argv()
    .file('local', configFile || `${configDir}/config.local.json`)
    .file(env, `${configDir}/config.${env}.json`)
    .file('default', `${configDir}/config.default.json`)
    .defaults({ PORT: 3000, NODE_ENV: 'development' });

  return store;
};
