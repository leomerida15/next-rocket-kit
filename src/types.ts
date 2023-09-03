import { resolverObj } from "./resolvers";
import { ResolverKeys } from "./resolvers/types";
export * from "./resolvers/types";

export interface ICreateRocketParams<K extends ResolverKeys> {
	resolver?: K;
}

export interface IResolver {
	ZodResolver: typeof resolverObj.zod;
	YupResolver: typeof resolverObj.yup;
}

export type RouteType = IResolver["YupResolver"] | IResolver["ZodResolver"];

export interface ICcreateRocketReturn {
	Route: RouteType;
}
