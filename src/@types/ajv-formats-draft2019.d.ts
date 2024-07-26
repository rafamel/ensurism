declare module 'ajv-formats-draft2019' {
  type Ajv = import('ajv').default;

  export default function add(ajv: Ajv, options?: Record<any, any>): Ajv;
}
