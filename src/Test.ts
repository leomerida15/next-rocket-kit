import * as yup from "yup";
import yupToOpenAPI from "@rudi23/yup-to-openapi";

export const Test = () => {
	const yupSchema = yup.object().shape({
		id: yup.string().uuid().required(),
		name: yup.string().min(2).required(),
	});

	const input = yup.string() as SchemaLike;
	const openApiSchema = yupToOpenAPI(input);

	console.log("openApiSchema", openApiSchema);
};
