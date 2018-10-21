# Example

Read main readme file to understand more about options loading order. Basically, it is:

1. Environment variables (process.env) with `__` as the separator.
2. *Local* config (usually not checked in to version control).
3. Environment specific config `<env>.config.json`.
4. *Default* config.
5. System defaults.

Follow those steps:

1. Try those commands to see different behaviour:

```shell
# Uses "default" config
node app.js

# Uses "production" config (with values inherited from "default")
NODE_ENV=production node app.js

# Overrides config option via env var:
# (Notice it does type casting "3001" -> 3001. It picked up type from json schema.)
server__port=3001 node app.js

# Custom NODE_ENV, and config override via environment variables
NODE_ENV=staging server__port=3001 node app.js
```

2. Try to add new property to a config, run the `app.js` and see validation warning from schema validation.
3. Try to add your local config overrides in `local.config.json` and run the `app.js`.
