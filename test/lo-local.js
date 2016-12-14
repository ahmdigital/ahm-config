const assert = require('assert');
const config = require('../lib');

describe('ahm-config: no-local', () => {
  const path = `${__dirname}/no-local`;

  it('should work fine when there is no config.local.json', () => {
    const store = config.make({ path });
    assert.equal(store.get('a'), 1);
  });

  it('should set defaults', () => {
    const store = config.make({ path });
    assert.equal(store.get('NODE_ENV'), 'development');
  });
});
