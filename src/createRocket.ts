import { resolverObj } from "./resolvers/resolverObj";
import { ICreateRocketParams } from "./types";
import { ResolverKeys } from "./resolvers";
import { Http } from "./httpStatus";
import { OasKeys } from "./docs/types";
import { createConfig } from "./config";
import { Oas } from "./docs";

/**
 * CreateRocket: generates a kit to workr back end in next.js with app folder
 *
 * @param {ICreateRocketParams} { resolver: "zod" | "yup", default "zod" };
 * @returns { Route, Http };
 */
export const createRocket = <K extends ResolverKeys, O extends OasKeys>(
	params?: ICreateRocketParams<K, O>,
) => {
	const config = createConfig(params);

	const Route = resolverObj[config.resolver];

	const OpenApi = Oas[config.oas];

	return { Route, Http, OpenApi };
};
