const config = require('../lib');

describe('ahm-config: type-casting', () => {
  const path = `${__dirname}/type-casting`;

  beforeAll(() => {
    process.env.a = '2';
    process.env.b = 'false';
    process.env.c = '3.45';
    process.env.d__e__f = '6.7';
  });

  afterAll(() => {
    delete process.env.a;
    delete process.env.b;
    delete process.env.c;
  });

  it('should return schema errors when normalise disabled', () =>
    new Promise((done) => {
      const onError = (err) => {
        expect(err.message).toEqual(
          "Config error: undefined is not of a type(s) integer. Value 'undefined' should be undefined.",
        );
        expect(err.meta).toEqual([
          {
            argument: ['integer'],
            instance: '2',
            message: 'is not of a type(s) integer',
            name: 'type',
            property: 'instance.a',
            schema: { required: true, type: 'integer' },
            stack: 'instance.a is not of a type(s) integer',
          },
          {
            argument: ['boolean'],
            instance: 'false',
            message: 'is not of a type(s) boolean',
            name: 'type',
            property: 'instance.b',
            schema: { required: true, type: 'boolean' },
            stack: 'instance.b is not of a type(s) boolean',
          },
          {
            argument: ['number'],
            instance: '3.45',
            message: 'is not of a type(s) number',
            name: 'type',
            property: 'instance.c',
            schema: { required: true, type: 'number' },
            stack: 'instance.c is not of a type(s) number',
          },
          {
            argument: ['number'],
            instance: '6.7',
            message: 'is not of a type(s) number',
            name: 'type',
            property: 'instance.d.e.f',
            schema: { required: true, type: 'number' },
            stack: 'instance.d.e.f is not of a type(s) number',
          },
        ]);
        done();
      };
      config.make({ path, normalise: false, onError });
    }));

  it('should type cast string literals to appropriate types', () => {
    const onError = () => {
      throw new Error('It should not happen');
    };
    const store = config.make({ path, normalise: true, onError });
    expect(store.get('a')).toBe(2);
    expect(store.get('b')).toBe(false);
    expect(store.get('c')).toBe(3.45);
    expect(store.get('d:e:f')).toBe(6.7);
  });
});
