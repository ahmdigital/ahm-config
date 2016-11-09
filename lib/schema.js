const _ = require('lodash');
const validator = require('is-my-json-valid');


exports.match = (schema) => {
  const paths = [];
  const walk = (context, obj) => {
    if (_.isNil(obj.properties)) {
      paths.push(context);
    } else {
      _.forEach(obj.properties, (val, key) => walk(context.concat([key]), val));
    }
  };
  walk([], schema);

  const pattern = paths.map(context => context.join('__')).join('|');
  return new RegExp(`^(${pattern})$`);
};


exports.validate = (store, originalSchema) => {
  // @HACK: when you do `store.defaults()` it adds `type: 'literal'` as a provider type.
  // Cannot find any nice ways to get rid of it, hence doing this.
  const schema = _.cloneDeep(originalSchema);
  _.assign(schema.properties, { type: { required: true, enum: ['literal'] } });

  const validate = validator(schema, {
    greedy: true,
    verbose: true,
  });

  validate(store.get());
  return validate.errors;
};


const castingFns = {
  integer: val => parseInt(val, 10),
  number: Number,
  boolean: val => (val === 'true'),
};

exports.normalise = (store, schema) => {
  const errors = exports.validate(store, schema);

  if (errors === null) { return; }

  errors
    .filter(({ type }) => castingFns[type])
    .forEach(({ field, type }) => {
      const key = field.substring(5).replace(/[.]/g, ':'); // convert 'data.a.b.c' into 'a:b:c'
      const val = castingFns[type](store.get(key));
      store.set(key, val);
    });
};
