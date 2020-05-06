const config = require('../lib');
const schema = require('../lib/schema');
const defaultSchema = require('./bad-schema/schema.json');

describe('ahm-config: basic', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'staging';
    process.env.NODE_CONFIG_DIR = `${__dirname}/basic`;
    process.env.NODE_CONFIG_FILE = `${__dirname}/basic/override.config.json`;
    process.env.e = 55555;
    process.env.g = 666666;
    process.env.arr_test = '["test", "test2"]';
    process.env.f__baz = 'Should not be shared';
  });

  afterAll(() => {
    delete process.env.NODE_ENV;
    delete process.env.NODE_CONFIG_DIR;
    delete process.env.NODE_CONFIG_FILE;
    delete process.env.e;
    delete process.env.g;
    delete process.env.f__baz;
  });

  describe('match()', () => {
    it('should contain all patternProperties', () => {
      const pattern = schema.match(defaultSchema);
      expect(pattern.test('multyKeyProp__test__a')).toBeTruthy();
      expect(pattern.test('multyKeyProp__test2__a')).toBeTruthy();
      expect(pattern.test('multyKeyProp__test__prop1')).toBeTruthy();
      expect(pattern.test('multyKeyProp__test2__prop1')).toBeTruthy();
      expect(pattern.test('multyKeyProp__test__prop11')).toEqual(false);
      expect(pattern.test('multyKeyProp__test2__prop11')).toEqual(false);
    });
  });

  it('should return proper config values from hierarchy', () => {
    const store = config.make();
    expect(store.get('a')).toBe(1);
    expect(store.get('b')).toBe(22);
    expect(store.get('c')).toBe(333);
    expect(store.get('d')).toBe(444);
    expect(store.get('e')).toBe(55555);
    expect(store.get('g')).toBeUndefined();
    expect(store.get('arr_test')).toEqual(['test', 'test2']);
  });

  it('should support isolated stores', () => {
    const storeA = config.make();
    const storeB = config.make();
    storeA.set('foo', 'bar');
    storeB.set('foo', 'baz');
    expect(storeA.get('foo')).toBe('bar');
    expect(storeB.get('foo')).toBe('baz');
  });

  it('should suport schema matching and environment variables isolation', () => {
    const store = config.make();
    expect(store.get('a')).toBe(1);
    expect(store.get('e')).toBe(55555);
    expect(store.get('f:foo')).toBe('bar');
    expect(store.get('f:baz')).toBeUndefined();
  });
});
