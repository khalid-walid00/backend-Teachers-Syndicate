function findFieldTypeInSchema(schema, fieldName) {
    if (!schema || !fieldName) return null;
  
    const field = schema[fieldName];
    if (!field) return null;
  
    if (typeof field === 'object' && field.type) {
      return field.type.name || typeof field.type;
    }
  
    return typeof field;
  }
  
  module.exports = findFieldTypeInSchema;
