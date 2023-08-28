import { ResolverKeys } from "./resolvers/types";
export * from "./resolvers/types";

export interface ICreateRocketParams<K extends ResolverKeys> {
	resolver: K;
}
