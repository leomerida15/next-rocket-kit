import { yupRoute } from "./yup/route";
import { zodRoute } from "./zod/route";

export const resolverObj = {
	yup: yupRoute,
	zod: zodRoute,
};

export const routeFactory = (key: keyof typeof resolverObj) => {
	return resolverObj[key];
};
