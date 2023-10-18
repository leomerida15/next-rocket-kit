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
	K extends ResolverKeys = "zod",
	O extends OasKeys = "3.1",
>(
	params?: ConfigObject<K, O>,
) => {
	const config = createConfig(params);

	const Route = resolverObj[config.resolver] as K extends "yup"
		? typeof resolverObj.yup
		: typeof resolverObj.zod;

	type onRoute = () => {
		Route: (params: Parameters<typeof Route>) => Promise<void | Response>;
	};

	const onRoute = (() => ({ Route })) as unknown as onRoute;

	const OpenApi = Oas[config.oas];

	return { Route, onRoute, Http, OpenApi };
};
