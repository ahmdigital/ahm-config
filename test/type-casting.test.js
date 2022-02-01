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
        expect(err.meta).toMatchSnapshot();
        done();
      };
      config.make({ normalise: false, onError, path });
    }));

  it('should type cast string literals to appropriate types', () => {
    const onError = () => {
      throw new Error('It should not happen');
    };
    const store = config.make({ normalise: true, onError, path });
    expect(store.get('a')).toBe(2);
    expect(store.get('b')).toBe(false);
    expect(store.get('c')).toBe(3.45);
    expect(store.get('d:e:f')).toBe(6.7);
  });
});
