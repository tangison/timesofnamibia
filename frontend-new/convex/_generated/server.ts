// Stub — replaced by `npx convex dev`.
/* eslint-disable @typescript-eslint/no-explicit-any */
export const query: any = (_args: any) => (_target: any) => _target;
export const mutation: any = (_args: any) => (_target: any) => _target;
export const action: any = (_args: any) => (_target: any) => _target;
export const internalQuery: any = (_args: any) => (_target: any) => _target;
export const internalMutation: any = (_args: any) => (_target: any) => _target;
export const internalAction: any = (_args: any) => (_target: any) => _target;
export const httpAction: any = (_target: any) => _target;

export const defineSchema: any = (_schema: any) => _schema;
export const defineTable: any = (args?: any) => ({
  ...args,
  index: () => defineTable(args),
});

export const paginationOpts: any = null;
export const type: any = null;

// Validator builders (used by convex/schema.ts)
export const v = {
  string: () => ({ type: "string" }),
  number: () => ({ type: "number" }),
  boolean: () => ({ type: "boolean" }),
  null: () => ({ type: "null" }),
  id: (_table?: string) => ({ type: "id" }),
  array: (validator: any) => ({ type: "array", value: validator }),
  object: (obj: any) => ({ type: "object", value: obj }),
  union: (...validators: any[]) => ({ type: "union", value: validators }),
  literal: (value: any) => ({ type: "literal", value }),
  optional: (validator: any) => ({ type: "optional", value: validator }),
  any: () => ({ type: "any" }),
};
