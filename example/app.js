/* eslint-disable no-console, import/no-unresolved */
const config = require('@ahmdigital/config').make({
  normalize: true,
  path: `${__dirname}/config`,
});

console.log('Whole config:');
console.log(config.get());

console.log('Server details:');
console.log(`http://${config.get('server:host')}:${config.get('server:port')}`);
