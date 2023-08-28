import { resolverObj } from "./resolvers/resolverObj";
import { ICreateRocketParams } from "./types";
import { ResolverKeys } from "./resolvers";

/**
 * CreateRocket: generates a kit to workr back end in next.js v13 with app folder
 *
 * @param {ICreateRocketParams} { resolver: "yup" | "zod" };
 * @returns {Route} { Route: YubRouteType | ZodRouteType };
 */
export const createRocket = <K extends ResolverKeys>({
	resolver,
}: ICreateRocketParams<K>) => ({
	Route: resolverObj[resolver],
});
