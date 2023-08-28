import { NextResponse } from "next/server";
import { TypeOf, ZodType, ZodTypeDef } from "zod";

export const responseFactory = <R extends ZodType<any, ZodTypeDef, any>,>(
	respnseSchemas?: R,
) => {
	return {
		rewrite: NextResponse.redirect,

		next: NextResponse.next,

		redirect: NextResponse.redirect,

		json(body: TypeOf<R>, init?: ResponseInit) {
			if (respnseSchemas) respnseSchemas.parse(body);

			return NextResponse.json<TypeOf<R>>(body, init);
		},
	};
};
