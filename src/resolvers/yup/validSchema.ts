import { AnyObject, ISchema, ObjectSchema } from "yup";
import { IYupRouteParams, YupReqType } from "./types";

export const validSchema = <
	B extends ISchema<any>,
	C extends ISchema<any>,
	Q extends ObjectSchema<AnyObject>,
	H extends ISchema<any>,
	R extends ISchema<any>,
>(
	Schemas: IYupRouteParams<B, C, Q, H, R>["schemas"],
	req: YupReqType<B, C, Q, H, R>,
) => {
	if (Schemas?.body) {
		const body = req.getBody();
		Schemas.body.validate(body);
	}

	if (Schemas?.context) {
		const context = req.getContext();
		Schemas.context.validate(context);
	}

	if (Schemas?.headers) {
		const headers = req.getHeaders();
		Schemas.headers.validate(headers);
	}

	if (Schemas?.query) {
		const query = req.getQuery(Object.keys(Schemas.query.fields));
		Schemas.query.validate(query);
	}
};
