import { resolverObj } from "./resolvers/resolverObj";
import { ConfigObject, OasKeys } from "./types";
import { ResolverKeys } from "./resolvers";
import { Http } from "./httpStatus";
import { createConfig } from "./config";
import { Oas } from "./docs";

/**
 * CreateRocket: generates a kit to workr back end in next.js with app folder
 *
 */
export const createRocket = <
	K extends ResolverKeys = "yup",
	O extends OasKeys = "3.1",
>(
	params?: ConfigObject<K, O>,
) => {
	const config = createConfig(params);

	const Route = resolverObj[config.resolver] as K extends "zod"
		? typeof resolverObj.zod
		: typeof resolverObj.yup;

	const OpenApi = Oas[config.oas];

	return { Route, Http, OpenApi };
};
