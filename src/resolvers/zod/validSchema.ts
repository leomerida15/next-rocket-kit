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
	if (Schemas?.body) {
		const body = req.getBody();
		Schemas.body.parse(body);
	}

	if (Schemas?.context) {
		const context = req.getContext();
		Schemas.context.parse(context);
	}

	if (Schemas?.headers) {
		const headers = req.getHeaders();
		Schemas.headers.parse(headers);
	}

	if (Schemas?.query) {
		const query = req.getQuery(Object.keys(Schemas.query.shape));
		Schemas.query.parse(query);
	}
};
