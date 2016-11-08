const _ = require('lodash');
const validator = require('is-my-json-valid');


exports.match = (schema) => {
  const paths = [];
  const walk = (context, obj) => {
    if (!obj.properties) {
      paths.push(context);
      return;
    }
    for (var key in obj.properties) {
      const leafContext = context.concat([key]);
      walk(leafContext, obj.properties[key]);
    }
  }
  walk([], schema);

  const pattern = paths.map((context) => context.join('__')).join('|');
  return new RegExp(`^(${pattern})$`);
};

exports.validate = (store, schema, options = {}) => {
  // @HACK: when you do `store.defaults()` it adds `type: 'literal'` as a provider type.
  // Cannot find any nice ways to get rid of it, hence doing this.
  schema.properties.type = { required: true, enum: ['literal'] };

  const validate = validator(schema, {
    greedy: true,
    verbose: true,
  });

  validate(store.get());
  return validate.errors;
};
