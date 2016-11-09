const assert = require('assert');
const config = require('../lib');

describe('ahm-config: type-casting', () => {
  const path = `${__dirname}/type-casting`;

  before(() => {
    process.env.a = '2';
    process.env.b = 'true';
    process.env.c = '3.45';
    process.env.d__e__f = '6.7';
  });

  after(() => {
    delete process.env.a;
    delete process.env.b;
    delete process.env.c;
  });

  it('should return schema errors when normalise disabled', (done) => {
    config.make({ path, normalise: false, onError: (err) => {
      assert.equal(err.message, "Config error: data.a is the wrong type. Value '2' should be integer.");
      assert.deepEqual(err.meta, [
        { field: 'data.a', message: 'is the wrong type', value: '2', type: 'integer' },
        { field: 'data.b', message: 'is the wrong type', value: 'true', type: 'boolean' },
        { field: 'data.c', message: 'is the wrong type',  value: '3.45', type: 'number' },
        { field: 'data.d.e.f', message: 'is the wrong type', value: '6.7', type: 'number' },
      ]);
      done();
    }});
  });

  it('should type cast string literals to appropriate types', () => {
    const store = config.make({ path, normalise: true, onError: (err) => {
      throw new Error('It should not happen');
    }});

    assert.strictEqual(store.get('a'), 2);
    assert.strictEqual(store.get('b'), true);
    assert.strictEqual(store.get('c'), 3.45);
    assert.strictEqual(store.get('d:e:f'), 6.7);
  });
});
