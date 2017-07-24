const assert = require('assert');
const config = require('../lib');

describe('ahm-config: type-casting', () => {
  const path = `${__dirname}/type-casting`;

  before(() => {
    process.env.a = '2';
    process.env.b = 'false';
    process.env.c = '3.45';
    process.env.d__e__f = '6.7';
  });

  after(() => {
    delete process.env.a;
    delete process.env.b;
    delete process.env.c;
  });

  it('should return schema errors when normalise disabled', (done) => {
    const onError = (err) => {
      assert.equal(err.message, 'Config error: undefined is not of a type(s) integer. ' +
        'Value \'undefined\' should be undefined.');
      assert.deepEqual(err.meta, [{
        property: 'instance.a',
        message: 'is not of a type(s) integer',
        schema: { required: true, type: 'integer' },
        instance: '2',
        name: 'type',
        argument: ['integer'],
        stack: 'instance.a is not of a type(s) integer',
      },
      {
        property: 'instance.b',
        message: 'is not of a type(s) boolean',
        schema: { required: true, type: 'boolean' },
        instance: 'false',
        name: 'type',
        argument: ['boolean'],
        stack: 'instance.b is not of a type(s) boolean',
      },
      {
        property: 'instance.c',
        message: 'is not of a type(s) number',
        schema: { required: true, type: 'number' },
        instance: '3.45',
        name: 'type',
        argument: ['number'],
        stack: 'instance.c is not of a type(s) number',
      },
      {
        property: 'instance.d.e.f',
        message: 'is not of a type(s) number',
        schema: { required: true, type: 'number' },
        instance: '6.7',
        name: 'type',
        argument: ['number'],
        stack: 'instance.d.e.f is not of a type(s) number',
      }]);
      done();
    };
    config.make({ path, normalise: false, onError });
  });

  it('should type cast string literals to appropriate types', () => {
    const onError = () => { throw new Error('It should not happen'); };
    const store = config.make({ path, normalise: true, onError });
    assert.strictEqual(store.get('a'), 2);
    assert.strictEqual(store.get('b'), false);
    assert.strictEqual(store.get('c'), 3.45);
    assert.strictEqual(store.get('d:e:f'), 6.7);
  });
});
