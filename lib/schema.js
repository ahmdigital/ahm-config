const _ = require('lodash');
const { validate } = require('jsonschema');
const traverse = require('traverse');

const validKeyRegex = /^[a-z0-9_\-$]+$/i;

exports.match = (schema) => {
  const paths = [];
  const walk = (context, obj) => {
    const props = _.assign({}, obj.properties, obj.patternProperties);
    if (_.isEmpty(props)) {
      paths.push(context);
    } else {
      _.forEach(props, (val, key) => walk(context.concat([key]), val));
    }
  };
  walk([], schema);

  const pattern = _.invokeMap(paths, 'join', '__').join('|');
  return new RegExp(`^(${pattern})$`);
};

exports.validateKeys = (data) => {
  const result = [];
  // eslint-disable-next-line lodash/prefer-lodash-method
  traverse(data).forEach(function context() {
    const path = this.path.join('.');
    if (!validKeyRegex.test(this.key)) {
      result.push({
        instance: path,
        message: `Has special characters in it (${validKeyRegex} are allowed)`,
        name: 'key',
        property: ['instance', path].join('.'),
      });
    }
  });
  return result;
};

exports.validate = (store, originalSchema) => {
  // @HACK: when you do `store.defaults()` it adds `type: 'literal'` as a provider type.
  // Cannot find any nice ways to get rid of it, hence doing this.
  const schema = _.cloneDeep(originalSchema);
  _.assign(schema.properties, { type: { enum: ['literal'], required: true } });

  const { errors } = validate(store.get(), schema);
  return _.union(errors, exports.validateKeys(store.get()));
};

const castingFns = {
  array: (val) => JSON.parse(val),
  boolean: (val) => val === 'true',
  integer: (val) => parseInt(val, 10),
  number: Number,
};

exports.normalise = (store, schema) => {
  const errors = exports.validate(store, schema);
  if (errors === null) {
    return;
  }

  _(errors)
    .filter({ name: 'type' })
    .filter(({ argument }) => _.has(castingFns, argument[0]))
    .forEach((error) => {
      const key = _.replace(error.property.substring(9), /[.]/g, ':'); // convert 'instance.a.b.c' into 'a:b:c'
      const val = castingFns[error.schema.type](store.get(key));
      store.set(key, val);
    });
};
