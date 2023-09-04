import { resolverObj } from "./resolvers/resolverObj";
import { ICreateRocketParams } from "./types";
import { ResolverKeys } from "./resolvers";

/**
 * CreateRocket: generates a kit to workr back end in next.js with app folder
 *
 * @param {ICreateRocketParams} { resolver: "zod" | "yup", default "zod" };
 * @returns { Route: RouteType };
 */
export const createRocket = <K extends ResolverKeys>(
	p: ICreateRocketParams<K>,
) => {
	const Route = resolverObj[p.resolver || "zod"];

	return { Route };
};
