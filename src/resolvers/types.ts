import { resolverObj } from "./resolverObj";
export * from "./zod/types";
export * from "./yup/types";

export type ResolverKeys = keyof typeof resolverObj;
