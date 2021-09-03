function createObjectFromSchema(schema, initialProps) {
  return Object.keys(schema).reduce((acc, key) => {
    if (Object.keys(schema[key])) {
      acc[key] = createObjectFromSchema(schema, initialProps);
    } else {
      acc[key] = initialProps[key];
    }
    return acc;
  }, {});
}

module.exports = {
  createObjectFromSchema,
};
