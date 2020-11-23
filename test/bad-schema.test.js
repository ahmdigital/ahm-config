const config = require('../lib');

describe('ahm-config: bad-schema', () => {
  const path = `${__dirname}/bad-schema`;

  it('should return schema errors when normalise disabled', () =>
    new Promise((done) => {
      const onError = (err) => {
        expect(err.message).toEqual(
          "Config error: undefined is not of a type(s) integer. Value 'undefined' should be undefined.",
        );
        expect(err.meta).toEqual([
          {
            argument: ['integer'],
            instance: 'asd',
            message: 'is not of a type(s) integer',
            name: 'type',
            property: 'instance.multyKeyProp.data.prop1',
            schema: { type: 'integer' },
            stack: 'instance.multyKeyProp.data.prop1 is not of a type(s) integer',
          },
          {
            instance: '/a',
            message: 'Has special characters in it (/^[a-z0-9_\\-$]+$/i are allowed)',
            name: 'key',
            property: 'instance./a',
          },
          {
            instance: '%x',
            message: 'Has special characters in it (/^[a-z0-9_\\-$]+$/i are allowed)',
            name: 'key',
            property: 'instance.%x',
          },
        ]);
        done();
      };
      config.make({ path, normalise: false, onError });
    }));

  it('should return schema errors when normalise enabled', () =>
    new Promise((done) => {
      const onError = (err) => {
        expect(err.meta).toEqual([
          {
            argument: ['integer'],
            message: 'is not of a type(s) integer',
            name: 'type',
            property: 'instance.multyKeyProp.data.prop1',
            schema: { type: 'integer' },
            stack: 'instance.multyKeyProp.data.prop1 is not of a type(s) integer',
          },
          {
            instance: '/a',
            message: 'Has special characters in it (/^[a-z0-9_\\-$]+$/i are allowed)',
            name: 'key',
            property: 'instance./a',
          },
          {
            instance: '%x',
            message: 'Has special characters in it (/^[a-z0-9_\\-$]+$/i are allowed)',
            name: 'key',
            property: 'instance.%x',
          },
        ]);
        done();
      };
      config.make({ path, normalise: true, onError });
    }));
});
