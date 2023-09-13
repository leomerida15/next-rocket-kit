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
	if (Schemas?.headers) {
		const headers = req.getHeaders();
		Schemas.headers.validate(headers);
	}

	if (Schemas?.context) {
		const context = req.getContext();
		Schemas.context.validate(context);
	}

	if (Schemas?.query) {
		const keys = Object.keys(Schemas.query.shape);

		const query = req.getQuery(keys);

		if (query) Schemas.query.validate(query);
		else Schemas.query.validate({});
	}

	if (Schemas?.body) {
		const body = req.getBody();
		Schemas.body.validate(body);
	}
};
