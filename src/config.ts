import { ICreateRocketParams, ResolverKeys } from ".";
import { OasKeys } from "./docs/types";

export const createConfig = <K extends ResolverKeys, O extends OasKeys>(
	params?: ICreateRocketParams<K, O>,
) => {
	const resolver = (params?.resolver || "zod") as ResolverKeys;

	const oas = (params?.oas || 31) as OasKeys;

	return { resolver, oas };
};
