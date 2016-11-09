const assert = require('assert');
const config = require('../lib');

describe('ahm-config: basic', () => {
  before(() => {
    process.env.NODE_ENV = 'staging';
    process.env.NODE_CONFIG_DIR = `${__dirname}/basic`;
    process.env.NODE_CONFIG_FILE = `${__dirname}/basic/override.config.json`;
    process.env.e = 55555;
    process.env.g = 666666;
    process.env.f__baz = 'Should not be shared';
  });

  after(() => {
    delete process.env.NODE_ENV;
    delete process.env.NODE_CONFIG_DIR;
    delete process.env.NODE_CONFIG_FILE;
    delete process.env.e;
    delete process.env.g;
    delete process.env.f__baz;
  });


  it('should return proper config values from hierarchy', () => {
    const store = config.make();
    assert.equal(store.get('a'), 1, 'Value should be taken from default config');
    assert.equal(store.get('b'), 22, 'Value should be taken from staging config');
    assert.equal(store.get('c'), 333, 'Value should be taken from custom config');
    assert.equal(store.get('d'), 444, 'Value should NOT be taken from .env file');
    assert.equal(store.get('e'), 55555, 'Value should be taken from env variables');
    assert.equal(store.get('g'), undefined, 'Value should not be taken from env vars');
  });

  it('should support isolated stores', () => {
    const storeA = config.make();
    const storeB = config.make();
    storeA.set('foo', 'bar');
    storeB.set('foo', 'baz');
    assert.equal(storeA.get('foo'), 'bar');
    assert.equal(storeB.get('foo'), 'baz');
  });

  it('should set defaults', () => {
    const store = config.make();
    assert.equal(store.get('NODE_ENV'), 'staging'); // overriden above
    assert.equal(store.get('PORT'), 3000);
  });

  it('should suport schema matching and environment variables isolation', () => {
    const store = config.make();
    assert.equal(store.get('a'), 1);
    assert.equal(store.get('e'), 55555);
    assert.equal(store.get('f:foo'), 'bar');
    assert.equal(store.get('f:baz'), undefined);
  });
});
