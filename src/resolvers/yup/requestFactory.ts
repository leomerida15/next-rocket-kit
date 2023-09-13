import { NextRequest } from "next/server";
import { IYupSchemasValid } from "./types";
import { formatParams } from "../methods/formatParams";
import { headers } from "next/headers";
import { IYupRequestFactoryResp } from "./types";
import { AnyObject, InferType, ISchema } from "yup";

export const requestFactory = async <
	B extends ISchema<any>,
	C extends ISchema<any>,
	Q extends ISchema<AnyObject>,
	H extends ISchema<any>,
	R extends ISchema<any>,
>(
	nativeRequest: NextRequest,
	context: InferType<C>,
	Schemas?: IYupSchemasValid<B, C, Q, H, R>,
) => {
	const body = await (async () => {
		const valid_methods = !["DELETE", "GET"].includes(nativeRequest.method);

		if (!(valid_methods && Schemas?.body)) return {};

		return await nativeRequest.json();
	})();

	const resp = {
		getHeaders: headers,
		getContext: (): InferType<C> => {
			const params = formatParams(context.params);

			return { ...context, params };
		},
		getQuery: (queriesArray: string[]): InferType<Q> | {} => {
			//
			const resQueries: any = {};
			if (!Object.keys(nativeRequest).includes("url")) return resQueries;

			const url = new URL(nativeRequest.url);

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
		getBody: (): InferType<B> => body,
	};

	return { ...resp, ...nativeRequest } as IYupRequestFactoryResp<B, C, Q>;
};
