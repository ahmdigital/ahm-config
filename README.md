# ahm-config

Config management module. It uses [nconf](https://github.com/indexzero/nconf) under the bonnet to manage config files, environment variables as a single system. It aims to simplify system configuration and config management. It also offers
means of config validation and normalization using json schema.


### Installation

```shell
$ npm i @ahmdigital/config
```

### Usage

```javascript
const config = require('@ahmdigital/config');

module.exports = config.make({ path: `${__dirname}/..` });
```

### Options

There're several options that `config.make` takes:

- `default` string - Path to *default* config file (default `dir/default.config.json`).
- `local` string - Path to *local* config file (default `dir/local.config.json`).
- `normalise` boolean - Attempt to normalise string literals that come from env (default `true`).
- `onError` function - Error callback function, e.g. when config doesn't match schema (default `console.error`).
- `path` string - Directory to look for json configs.
- `schema` string - Path to *json schema* file (default `dir/schema.json`).

See [Example](https://github.com/ahmdigital/ahm-config/tree/master/example).

#### Load order

Configuration is loaded in the following order:

1. Environment variables (process.env) with `__` as the separator.
2. *Local* config (usually not checked in to version control).
3. Environment specific config `<env>.config.json`.
4. *Default* config.
5. System defaults.


#### Environment configuration control

 - `NODE_ENV` current environment name, e.g. `development` or `production`
 - `NODE_CONFIG_DIR` directory where to look for config files, project's base directory by default
 - `NODE_CONFIG_FILE` custom config file with overrides
 - `foo__bar__baz` to override `foo: { bar: { baz: value } }`


#### Considerations

 - Use hierarchical configs where possible
 - Use json types where it makes sense, avoid type casting later on in your consumer code
 - Keep devops specific config values (like elasticache hostname) in infrastructure config
 - Keep sensitive values in infrastructure config or/and consider config encryption - [nconf can do it](https://github.com/indexzero/nconf#encrypting-file-contents)
