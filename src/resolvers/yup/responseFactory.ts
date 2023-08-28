import { NextResponse } from "next/server";
import { ISchema, InferType } from "yup";

export const responseFactory = <R extends ISchema<any>,>(
	respnseSchemas?: R,
) => {
	return {
		rewrite: NextResponse.redirect,

		next: NextResponse.next,

		redirect: NextResponse.redirect,

		json: (body: InferType<R>, init?: ResponseInit) => {
			if (respnseSchemas) respnseSchemas.validate(body);

			return NextResponse.json<InferType<R>>(body, init);
		},
	};
};
