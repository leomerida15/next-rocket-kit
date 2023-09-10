import { Oas } from ".";
import { oas30, oas31 } from "openapi3-ts";

export type OasKeys = keyof typeof Oas;

export type OpenAPIObjectOas30 = oas30.OpenAPIObject;

export type OpenAPIObjectOas31 = oas31.OpenAPIObject;
