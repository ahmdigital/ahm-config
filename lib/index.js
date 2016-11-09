const assert = require('assert');
const fs = require('fs');
const nconf = require('nconf');
const path = require('path');
const { match, normalise, validate } = require('./schema');

exports.make = (opts = {}) => {
  opts.path = opts.path || process.env.NODE_CONFIG_DIR || path.resolve(__dirname, '../../..');
  opts.normalise = (typeof opts.normalise !== 'undefined') ? opts.normalise : true;
  opts.local = opts.local || process.env.NODE_CONFIG_FILE || path.resolve(opts.path, 'local.config.json');
  opts.onError = opts.onError || console.error;
  opts.schema = opts.schema || path.resolve(opts.path, 'schema.json');

  const store = new nconf.Provider();
  const env = process.env.NODE_ENV || 'development';

  assert(fs.existsSync(opts.path), `${opts.path} does not seem to exist`);
  assert(fs.existsSync(opts.schema), `${opts.schema} does not seem to exist, schema is mandatory`);

  // if (opts.local) {
  //   assert(fs.existsSync(opts.local), `${opts.local} does not seem to exist`);
  // }

  const schema = require(opts.schema);

  /**
   * Setup configuration with nconf in the following order:
   *   1. Environment variables (process.env) with '__' as the separator
   *   2. Custom config (if provided)
   *   3. Environment specific config '<env>.config.json'
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
    .file('local', opts.local)
    .file(env, path.resolve(opts.path, `${env}.config.json`))
    .file('default', path.resolve(opts.path, `default.config.json`))
    .defaults({ PORT: 3000, NODE_ENV: 'development' });

  // Attempt to type-cast string literals to appropriate data types as per schema
  if (opts.normalise) { normalise(store, schema); }

  const errors = validate(store, schema);
  if (errors) {
    const { field, message, value, type } = errors[0];
    const err = new Error(`Config error: ${field} ${message}. Value '${value}' should be ${type}.`);
    err.meta = errors;
    opts.onError(err);
  }

  return store;
};
