const config = require('../lib');

describe('ahm-config: bad-schema', () => {
  const path = `${__dirname}/bad-schema`;

  it('should return schema errors when normalise disabled', () =>
    new Promise((done) => {
      const onError = (err) => {
        expect(err.message).toEqual(
          "Config error: undefined is not of a type(s) integer. Value 'undefined' should be undefined.",
        );
        expect(err.meta).toMatchSnapshot();
        done();
      };
      config.make({ path, normalise: false, onError });
    }));

  it('should return schema errors when normalise enabled', () =>
    new Promise((done) => {
      const onError = (err) => {
        expect(err.meta).toMatchSnapshot();
        done();
      };
      config.make({ path, normalise: true, onError });
    }));
});
