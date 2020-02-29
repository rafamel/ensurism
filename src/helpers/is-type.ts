import { Type, BasicType } from '~/types';

export function isType(value: any): value is Type {
  return isBasicType(value) || typeof value === 'object';
}

export function isBasicType(value: any): value is BasicType {
  switch (typeof value) {
    case 'undefined':
    case 'string':
    case 'number':
    case 'boolean': {
      return true;
    }
    case 'object': {
      return value === null;
    }
    default: {
      return false;
    }
  }
}
