import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ValidationSchemas, Request, ResolverFunction } from '../types';

/**
 * Zod resolver for route validation
 * Validates request body, params, and query parameters using Zod schemas
 */
const routeResolver = async <TBody = any, TParams = any, TQuery = any>(
    req: NextRequest,
    schemas?: ValidationSchemas<TBody, TParams, TQuery>,
): Promise<Request<TBody, TParams, TQuery>> => {
    const extendedReq = req as Request<TBody, TParams, TQuery>;

    // Validate and parse body
    if (schemas?.body) {
        try {
            const bodyText = await req.text();
            const bodyData = bodyText ? JSON.parse(bodyText) : {};
            const validatedBody = schemas.body.parse(bodyData);
            extendedReq._validatedBody = validatedBody;
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new Error(
                    `Body validation failed: ${error.errors.map((e) => e.message).join(', ')}`,
                );
            }
            throw error;
        }
    }

    // Validate and parse params
    if (schemas?.params) {
        try {
            const params = Object.fromEntries(
                req.nextUrl.pathname
                    .split('/')
                    .filter(Boolean)
                    .map((segment, index) => [`param${index}`, segment]),
            );
            const validatedParams = schemas.params.parse(params);
            extendedReq._validatedParams = validatedParams;
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new Error(
                    `Params validation failed: ${error.errors.map((e) => e.message).join(', ')}`,
                );
            }
            throw error;
        }
    }

    // Validate and parse query parameters
    if (schemas?.queryParams) {
        try {
            const queryParams = Object.fromEntries(req.nextUrl.searchParams.entries());
            const validatedQuery = schemas.queryParams.parse(queryParams);
            extendedReq._validatedQuery = validatedQuery;
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new Error(
                    `Query validation failed: ${error.errors.map((e) => e.message).join(', ')}`,
                );
            }
            throw error;
        }
    }

    // Add getter methods
    extendedReq.getBody = () => extendedReq._validatedBody as TBody;
    extendedReq.getParams = () => extendedReq._validatedParams as TParams;
    extendedReq.getQueryParams = () => extendedReq._validatedQuery as TQuery;

    return extendedReq;
};

/**
 * Zod resolver for action validation
 * Validates input data using Zod schemas
 */
const actionResolver = async <TInput = any>(
    input: any,
    schema?: z.ZodSchema<TInput>,
): Promise<TInput> => {
    if (!schema) {
        return input as TInput;
    }

    try {
        return schema.parse(input);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(
                `Action validation failed: ${error.errors.map((e) => e.message).join(', ')}`,
            );
        }
        throw error;
    }
};

/**
 * Zod resolver object that provides both route and action validation
 */
export const zodResolver: ResolverFunction = {
    route: routeResolver,
    action: actionResolver,
};
