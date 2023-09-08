import { OasKeys } from "./docs/types";
import { resolverObj } from "./resolvers";
import { ResolverKeys } from "./resolvers/types";
export * from "./resolvers/types";

export interface ICreateRocketParams<
	K extends ResolverKeys = "zod",
	O extends OasKeys = 31,
> {
	resolver?: K;
	oas?: O;
}

export interface IResolver {
	zod: typeof resolverObj.zod;
	yup: typeof resolverObj.yup;
}
