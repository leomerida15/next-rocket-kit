import { ConfigObject, ResolverKeys } from ".";
import { OasKeys } from "./docs/types";

export const createConfig = <K extends ResolverKeys, O extends OasKeys>(
	params?: ConfigObject<K, O>,
) => {
	console.log("params", params);
	const resolver = (params?.resolver || "zod") as ResolverKeys;

	const oas = (params?.oas || "3.1") as OasKeys;

	return { resolver, oas };
};
