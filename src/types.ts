import { resolverObj } from "./resolvers";
import { ResolverKeys } from "./resolvers/types";
export * from "./resolvers/types";

export interface ICreateRocketParams<K extends ResolverKeys> {
	resolver?: K;
}

export interface IResolver {
	zod: typeof resolverObj.zod;
	yup: typeof resolverObj.yup;
}
