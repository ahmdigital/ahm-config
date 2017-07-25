const assert = require('assert');
const config = require('../lib');

describe('ahm-config: bad-schema', () => {
  const path = `${__dirname}/bad-schema`;

  it('should return schema errors when normalise disabled', (done) => {
    const onError = (err) => {
      assert.equal(
        err.message,
        'Config error: undefined is not of a type(s) integer. Value \'undefined\' should be undefined.');
      assert.deepEqual(err.meta, [{
        property: 'instance.multyKeyProp.prop1',
        message: 'is not of a type(s) integer',
        schema: { type: 'integer' },
        instance: 'asd',
        name: 'type',
        stack: 'instance.multyKeyProp.prop1 is not of a type(s) integer',
        argument: ['integer'],
      },
      {
        property: 'instance./a',
        message: 'Has special characters in it (/^[a-z0-9_-]+$/i are allowed)',
        instance: '/a',
        name: 'key',
      },
      {
        property: 'instance.$x',
        message: 'Has special characters in it (/^[a-z0-9_-]+$/i are allowed)',
        instance: '$x',
        name: 'key',
      }]);
      done();
    };
    config.make({ path, normalise: false, onError });
  });

  it('should return schema errors when normalise enabled', (done) => {
    const onError = (err) => {
      assert.deepEqual(err.meta, [{
        property: 'instance.multyKeyProp.prop1',
        message: 'is not of a type(s) integer',
        schema: { type: 'integer' },
        name: 'type',
        argument: ['integer'],
        stack: 'instance.multyKeyProp.prop1 is not of a type(s) integer',
      },
      {
        property: 'instance./a',
        message: 'Has special characters in it (/^[a-z0-9_-]+$/i are allowed)',
        instance: '/a',
        name: 'key',
      },
      {
        property: 'instance.$x',
        message: 'Has special characters in it (/^[a-z0-9_-]+$/i are allowed)',
        instance: '$x',
        name: 'key',
      }]);
      done();
    };
    config.make({ path, normalise: true, onError });
  });
});
