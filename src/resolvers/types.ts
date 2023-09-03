import { StatusCodes } from "http-status-codes";
import { resolverObj } from "./resolverObj";
export * from "./zod/types";
export * from "./yup/types";

export type ResolverKeys = keyof typeof resolverObj;

export interface ReplyInit extends Omit<ResponseInit, "status"> {
	status?: StatusCodes;
}
