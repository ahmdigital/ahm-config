const config = require('../lib');

describe('ahm-config: no-local', () => {
  const path = `${__dirname}/no-local`;

  it('should work fine when there is no config.local.json', () => {
    const store = config.make({ path });
    expect(store.get('a')).toBe(1);
  });

  it('should set defaults', () => {
    const store = config.make({ path });
    expect(store.get('NODE_ENV')).toBe('test');
  });
});
