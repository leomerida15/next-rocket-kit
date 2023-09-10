import { resolverObj } from "./resolvers";
import { ResolverKeys } from "./resolvers/types";
export * from "./resolvers/types";

/**
 * Configuration object for the Rocket-kit.
 *
 * @export
 * @abstract
 * @class ConfigObject
 * @type { resolver: "zod" | "yup" }
 */
export declare abstract class ConfigObject<K extends ResolverKeys = "zod",> {
	/**
	 * Packet to validate data in the Route.
	 * @default "zod"
	 * @type "zod" | "yup"
	 */
	resolver?: K;
}

export interface IResolver {
	zod: typeof resolverObj.zod;
	yup: typeof resolverObj.yup;
}
