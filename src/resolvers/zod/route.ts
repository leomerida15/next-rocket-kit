import { NextRequest, NextResponse } from "next/server";
import { ZodType, ZodTypeDef, ZodObject, TypeOf } from "zod";
import { ZodActionReturnType, IZodRouteParams } from "./types";
import { requestFactory } from "./requestFactory";
import { responseFactory } from "./responseFactory";

export const zodRoute = <
	B extends ZodType<any, ZodTypeDef, any>,
	C extends ZodObject<any>,
	Q extends ZodObject<any>,
	H extends ZodObject<any>,
	R extends ZodType<any, ZodTypeDef, any>,
>(
	P: IZodRouteParams<B, C, Q, H, R> | IZodRouteParams<B, C, Q, H, R>["Handler"],
) => {
	return async (
		nextRequest: NextRequest,
		context: TypeOf<C>,
	): Promise<ZodActionReturnType<B, C, Q, H, R>> => {
		try {
			if (typeof P === "object") {
				const { schemas, Handler } = P;
				const req = await requestFactory<B, C, Q, H, R>(
					nextRequest,
					context,
					schemas,
				);

				const reply = responseFactory(schemas?.response);

				if (!(Handler instanceof Promise)) {
					const resp = await Handler(req, reply, context);
					return resp;
				}

				const resp = await Handler(req, reply, context);

				return resp;
			}

			const req = await requestFactory<B, C, Q, H, R>(nextRequest, context);

			const reply = responseFactory();

			const pResponse = P(req, reply, context);

			return pResponse;
		} catch (error) {
			return NextResponse.json((error as any).errors, { status: 400 });
		}
	};
};
