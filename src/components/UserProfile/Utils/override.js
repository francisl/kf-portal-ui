import { omit } from 'lodash/object';

export default function override(obj, newField) {
  const newFields = Array.isArray(newField) ? newField : [newField];

  const temp = omit(obj, newFields.map(f => Object.keys(f)));
  newFields.forEach(f => temp[Object.keys(f)] = f[Object.keys(f)[0]]);

  return temp;
}