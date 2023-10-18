import { NextRequest, NextResponse } from "next/server";
import { requestFactory } from "./requestFactory";
import { responseFactory } from "./responseFactory";
import { IYupRouteParams } from "./types";
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
	const controllerFactory = (
		nextRequest: NextRequest,
		context: InferType<C>,
	): void => {
		try {
			const { schemas, Handler } = ((): {
				schemas?: IYupRouteParams<B, C, Q, H, R>["schemas"];
				Handler: IYupRouteParams<B, C, Q, H, R>["Handler"];
			} => {
				if (typeof P === "object")
					return {
						schemas: P.schemas,
						Handler: P.Handler,
					};

				return {
					Handler: P,
				};
			})();

			requestFactory<B, C, Q, H, R>(nextRequest, context, schemas)
				.then((req) => {
					const reply = responseFactory(schemas?.response);

					Handler(req, reply, context);
				})
				.finally();
		} catch (error) {
			NextResponse.json((error as any).errors, { status: 400 });
		}
	};

	return void controllerFactory;
};
