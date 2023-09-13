import { NextRequest, NextResponse } from "next/server";
import { requestFactory } from "./requestFactory";
import { responseFactory } from "./responseFactory";
import { validSchema } from "./validSchema";
import { IYupRouteParams, YupActionReturnType } from "./types";
import { ISchema, AnyObject, InferType, ObjectSchema } from "yup";

export const yupRoute = <
	B extends ISchema<any>,
	C extends ISchema<any>,
	Q extends ObjectSchema<AnyObject>,
	H extends ISchema<any>,
	R extends ISchema<any>,
>(
	P: IYupRouteParams<B, C, Q, H, R> | IYupRouteParams<B, C, Q, H, R>["Handler"],
) => {
	return async (
		nextRequest: NextRequest,
		context: InferType<C>,
	): Promise<YupActionReturnType<B, C, Q, H, R>> => {
		try {
			if (typeof P === "object") {
				const { schemas, Handler } = P;
				const req = await requestFactory<B, C, Q, H, R>(
					nextRequest,
					context,
					schemas,
				);

				validSchema<B, C, Q, H, R>(schemas, req);

				const reply = responseFactory(schemas?.response);

				return Handler(req, reply, context);
			}

			const req = await requestFactory<B, C, Q, H, R>(nextRequest, context);

			const reply = responseFactory();

			return P(req, reply, context);
		} catch (error) {
			return NextResponse.json((error as any).errors, { status: 400 });
		}
	};
};
