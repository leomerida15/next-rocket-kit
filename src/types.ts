import { NextRequest } from 'next/server';
import z from 'zod';

export interface ValidationSchemas<TBody = any, TParams = any, TQuery = any> {
    body?: z.ZodSchema<TBody>;
    params?: z.ZodSchema<TParams>;
    queryParams?: z.ZodSchema<TQuery>;
}
export interface Request<TBody = any, TParams = any, TQuery = any> extends NextRequest {
    getBody(): TBody;
    getParams(): TParams;
    getQueryParams(): TQuery;
    _validatedBody?: TBody;
    _validatedParams?: TParams;
    _validatedQuery?: TQuery;
}
