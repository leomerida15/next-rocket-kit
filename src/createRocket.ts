import { resolverObj } from "./resolvers/resolverObj";
import { ConfigObject } from "./types";
import { ResolverKeys } from "./resolvers";
import { Http } from "./httpStatus";
import { createConfig } from "./config";
import { Oas } from "./docs";

/**
 * CreateRocket: generates a kit to workr back end in next.js with app folder
 *
 * @param {ConfigObject} { resolver: "zod" | "yup", default "zod" };
 * @returns {Object} { Route, Http, OpenApi };
 */
export const createRocket = <K extends ResolverKeys>(
	params?: ConfigObject<K>,
) => {
	const config = createConfig(params);

	const Route = resolverObj[config.resolver];

	const OpenApi = Oas;

	return { Route, Http, OpenApi };
};
