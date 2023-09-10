import { ConfigObject, ResolverKeys } from ".";

export const createConfig = <K extends ResolverKeys>(
	params?: ConfigObject<K>,
) => {
	const resolver = (params?.resolver || "zod") as ResolverKeys;

	return { resolver };
};
