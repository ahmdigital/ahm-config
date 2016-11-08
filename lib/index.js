const assert = require('assert');
const fs = require('fs');
const nconf = require('nconf');
const path = require('path');
const { match, normalise, validate } = require('./schema');

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
   *   2. Custom config (if provided)
   *   3. Environment specific config 'config.<env>.json'
   *   4. User-specified default values
   *   5. System defaults
   */
  store
    .use('memory')
    .env({
      separator: '__',
      match: match(schema),
      whitelist: ['PORT', 'NODE_ENV'],
    })
    .file('local', configFile || `${configDir}/local.config.json`)
    .file(env, `${configDir}/${env}.config.json`)
    .file('default', `${configDir}/default.config.json`)
    .defaults({ PORT: 3000, NODE_ENV: 'development' });

  // Attempt to type-cast string literals to appropriate data types as per schema
  normalise(store, schema);

  const errors = validate(store, schema);
  if (errors) {
    const { field, message, value, type } = errors[0];
    console.error(`Config error: ${field} ${message}. Value '${value}'' should be ${type}.`);
    process.exit(1);
  }

  return store;
};
