import { NextRequest } from "next/server";
import { ZodType, ZodTypeDef, ZodObject, TypeOf } from "zod";
import { IZodSchemasValid } from "./types";
import { formatParams } from "../methods/formatParams";
import { headers } from "next/headers";
import { IZodRequestFactoryResp } from "./types";

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
	const body = await (async () => {
		const valid_methods = !["DELETE", "GET"].includes(nativeRequest.method);

		if (!(valid_methods && Schemas?.body)) return {};

		return await nativeRequest.json();
	})();

	const resp = {
		getHeaders: headers,
		getContext: (): TypeOf<C> => {
			const params = formatParams(context.params);

			return { ...context, params };
		},
		getQuery: (queriesArray: string[]): TypeOf<Q> => {
			//
			if (nativeRequest.url) return {};

			const url = new URL(nativeRequest.url);

			const resQueries: any = {};

			queriesArray.map((q: string) => {
				const validItem = Number(url.searchParams.get(q));
				if (validItem !== 0 && !validItem) {
					resQueries[q] = url.searchParams.get(q);
				} else {
					resQueries[q] = validItem;
				}
			});
			return resQueries;
		},
		getBody: (): TypeOf<B> => body,
	};

	return { ...resp, ...nativeRequest } as IZodRequestFactoryResp<B, C, Q>;
};
