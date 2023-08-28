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
	const url = new URL(nativeRequest.url);
	const body = nativeRequest.body
		? await nativeRequest.json()
		: nativeRequest.body;

	const resp = {
		getHeaders: headers,
		getContext: (): TypeOf<C> => {
			const params = formatParams(context.params);

			return { ...context, params };
		},
		getQuery: (queriesArray: string[]): TypeOf<Q> => {
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
		getBody: (): TypeOf<B> => {
			if (
				body &&
				!["DELETE", "GET"].includes(nativeRequest.method) &&
				Schemas?.body
			) {
				return body;
			}

			return {};
		},
	};

	return { ...resp, ...nativeRequest } as IZodRequestFactoryResp<B, C, Q>;
};
