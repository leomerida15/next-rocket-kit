import { NextRequest } from "next/server";
import { ZodType, ZodTypeDef, ZodObject, TypeOf } from "zod";
import { IZodSchemasValid } from "./types";
import { IZodRequestFactoryResp } from "./types";
import ValidAndFormat from "./ValidAndFormat";

export const requestFactory = async <
	B extends ZodType<any, ZodTypeDef, any>,
	C extends ZodObject<any>,
	Q extends ZodObject<any>,
	H extends ZodObject<any>,
	R extends ZodType<any, ZodTypeDef, any>,
>(
	nativeRequest: NextRequest,
	context: TypeOf<C>,
	Schemas?: IZodSchemasValid<B, C, Q, H, R>,
) => {
	const validAndFormat = new ValidAndFormat<B, C, Q, H, R>(
		nativeRequest,
		context,
		Schemas,
	);

	const Headers = validAndFormat.headers();

	const Context = validAndFormat.context();

	const Query = validAndFormat.query();

	const body = await validAndFormat.body();

	const resp = {
		getHeaders: () => Headers,
		getContext: () => Context,
		getQuery: (keys: Array<keyof TypeOf<Q> | string>) => Query(keys),
		getBody: () => body,
	};

	return { ...resp, ...nativeRequest } as IZodRequestFactoryResp<B, C, Q>;
};
