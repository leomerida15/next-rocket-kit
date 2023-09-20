import { NextRequest, NextResponse } from "next/server";
import { requestFactory } from "./requestFactory";
import { responseFactory } from "./responseFactory";
import { IYupRouteParams, YupActionReturnType } from "./types";
import { AnyObject, InferType, ObjectSchema } from "yup";

export const yupRoute = <
	B extends ObjectSchema<AnyObject>,
	C extends ObjectSchema<AnyObject>,
	Q extends ObjectSchema<AnyObject>,
	H extends ObjectSchema<AnyObject>,
	R extends ObjectSchema<AnyObject>,
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
