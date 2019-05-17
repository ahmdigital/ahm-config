const assert = require('assert');
const fs = require('fs');
const nconf = require('nconf');
const path = require('path');
const _ = require('lodash');
const { match, normalise, validate } = require('./schema');


exports.make = (originalOpts = {}) => {
  const opts = _.cloneDeep(originalOpts);
  _.defaults(opts, { path: process.env.NODE_CONFIG_DIR }, { path: path.resolve(__dirname, '../../..') });
  _.defaults(opts, {
    normalise: true,
    local: process.env.NODE_CONFIG_FILE,
    onError: console.error, // eslint-disable-line no-console
    schema: path.resolve(opts.path, 'schema.json'),
    default: path.resolve(opts.path, 'default.config.json'),
  }, {
    local: path.resolve(opts.path, 'local.config.json'),
  });

  const store = new nconf.Provider();
  const env = process.env.NODE_ENV || 'development';

  assert(fs.existsSync(opts.path), `${opts.path} does not seem to exist`);
  assert(fs.existsSync(opts.schema), `${opts.schema} does not seem to exist, schema is mandatory`);
  assert(fs.existsSync(opts.default), `${opts.default} does not seem to exist`);
  assert(_.isFunction(opts.onError), 'onError should be a function');

  const schema = require(opts.schema); // eslint-disable-line global-require, import/no-dynamic-require

  /**
   * Setup configuration with nconf in the following priority:
   *   1. Environment variables (process.env) with '__' as the separator.
   *   2. Local config (usually not checked in to version control).
   *   3. Environment specific config '<env>.config.json'.
   *   4. User-specified default values.
   *   5. System defaults.
   */
  store
    .use('memory')
    .env({
      separator: '__',
      match: match(schema),
      whitelist: ['NODE_ENV'],
    })
    .file('local', opts.local)
    .file(env, path.resolve(opts.path, `${env}.config.json`))
    .file('default', opts.default)
    .defaults({ NODE_ENV: 'development' });

  // Attempt to type-cast string literals to appropriate data types as per schema
  if (opts.normalise) { normalise(store, schema); }
  const errors = validate(store, schema);
  if (errors.length) {
    const { field, message, value, type } = errors[0];
    const err = new Error(`Config error: ${field} ${message}. Value '${value}' should be ${type}.`);
    err.meta = errors;
    opts.onError(err);
  }

  return store;
};
