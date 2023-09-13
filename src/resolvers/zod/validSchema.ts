import { ZodType, ZodTypeDef, ZodObject } from "zod";
import { IZodRouteParams } from "./types";

export const validSchema = <
	B extends ZodType<any, ZodTypeDef, any>,
	C extends ZodObject<any>,
	Q extends ZodObject<any>,
	H extends ZodObject<any>,
	R extends ZodType<any, ZodTypeDef, any>,
>(
	Schemas: IZodRouteParams<B, C, Q, H, R>["schemas"],
	req: Parameters<IZodRouteParams<B, C, Q, H, R>["Handler"]>["0"],
) => {
	if (Schemas?.headers) {
		const headers = req.getHeaders();
		Schemas.headers.parse(headers);
	}

	if (Schemas?.context) {
		const context = req.getContext();
		Schemas.context.parse(context);
	}

	if (Schemas?.query) {
		const keys = Object.keys(Schemas.query.shape);

		req.getQuery(keys);
	}

	if (Schemas?.body) {
		const body = req.getBody();
		Schemas.body.parse(body);
	}
};
