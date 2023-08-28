import { NextRequest, NextResponse } from "next/server";
import { ZodType, ZodTypeDef, ZodObject, TypeOf } from "zod";
import { ZodActionReturnType, IZodRouteParams } from "./types";
import { requestFactory } from "./requestFactory";
import { responseFactory } from "./responseFactory";
import { validSchema } from "./validSchema";

export const zodRoute = <
	B extends ZodType<any, ZodTypeDef, any>,
	C extends ZodObject<any>,
	Q extends ZodObject<any>,
	H extends ZodObject<any>,
	R extends ZodType<any, ZodTypeDef, any>,
>({
	schemas,
	Handler,
}: IZodRouteParams<B, C, Q, H, R>) => {
	return async (
		nextRequest: NextRequest,
		context: TypeOf<C>,
	): Promise<ZodActionReturnType<B, C, Q, H, R>> => {
		try {
			const req = await requestFactory<B, C, Q, H, R>(
				nextRequest,
				context,
				schemas,
			);

			validSchema<B, C, Q, H, R>(schemas, req);

			const reply = responseFactory(schemas?.response);

			return Handler(req, reply, context);
		} catch (error) {
			return NextResponse.json((error as any).errors, { status: 400 });
		}
	};
};
