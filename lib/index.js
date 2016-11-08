const assert = require('assert');
const fs = require('fs');
const nconf = require('nconf');
const path = require('path');
const { match, validate } = require('./validate');

exports.make = (opts) => {
  const store = new nconf.Provider();
  const env = process.env.NODE_ENV || 'development';
  const configDir = process.env.NODE_CONFIG_DIR || opts.path || `${__dirname}/../../..`;
  const configFile = process.env.NODE_CONFIG_FILE;
  const schemaFile = path.resolve(configDir, 'schema.json');

  assert(fs.existsSync(configDir), `${configDir} does not seem to exist`);
  assert(fs.existsSync(schemaFile), `${schemaFile} does not seem to exist, schema is mandatory`);

  if (configFile) {
    assert(fs.existsSync(configFile), `${configFile} does not seem to exist`);
  }

  const schema = require(schemaFile);

  /**
   * Setup configuration with nconf in the following order:
   *   1. Environment variables (process.env) with '__' as the separator
   *   2. Command line arguments (process.argv)
   *   3. Custom config (if provided)
   *   4. Environment specific config 'config.<env>.json'
   *   5. User-specified default values
   *   6. System defaults
   */
  store
    .env({
      separator: '__',
      match: match(schema),
      whitelist: ['PORT', 'NODE_ENV'],
    })
    // .argv()
    .file('local', configFile || `${configDir}/local.config.json`)
    .file(env, `${configDir}/${env}.config.json`)
    .file('default', `${configDir}/default.config.json`)
    .defaults({ PORT: 3000, NODE_ENV: 'development' });

  const errors = validate(store, schema);
  if (errors) {
    console.error(errors);
    process.exit(1);
  }

  return store;
};
