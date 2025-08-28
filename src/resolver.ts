import { z } from 'zod';
import { NextRequest } from 'next/server';
import { ValidationSchemas, Request } from './types';

/**
 * Resolver unificado que contiene funciones para Route y Action
 */
export const zodResolver = {
    /**
     * Resuelve y valida los datos de la request usando Zod schemas para rutas
     * @param req - NextRequest original
     * @param schemas - Schemas de validación para body, params y queryParams
     * @returns Request extendida con métodos de validación
     */
    route: async <TBody = any, TParams = any, TQuery = any>(
        req: NextRequest,
        schemas?: ValidationSchemas<TBody, TParams, TQuery>,
    ): Promise<Request<TBody, TParams, TQuery>> => {
        // Crear una copia extendida del request
        const extendedReq = req as Request<TBody, TParams, TQuery>;

        // Función helper para validar datos
        const validateData = async <T>(
            schema: z.ZodSchema<T> | undefined,
            data: any,
            errorMessage: string,
        ): Promise<T | undefined> => {
            if (!schema) return undefined;

            try {
                return await schema.parseAsync(data);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    throw new Error(`errorMessage: ${errorMessage} - ${error.message}`, {
                        cause: error,
                    });
                }
                throw error;
            }
        };

        // Validar body
        if (schemas?.body) {
            try {
                const body = await req.json().catch(() => ({}));
                extendedReq._validatedBody = await validateData(
                    schemas.body,
                    body,
                    'Body validation failed',
                );
            } catch (error) {
                extendedReq._validatedBody = await validateData(
                    schemas.body,
                    {},
                    'Body validation failed',
                );
            }
        }

        // Validar params (desde la URL)
        if (schemas?.params) {
            const url = new URL(req.url);
            const pathSegments = url.pathname.split('/').filter(Boolean);
            const params = Object.fromEntries(
                pathSegments.map((segment, index) => [`param${index}`, segment]),
            );
            extendedReq._validatedParams = await validateData(
                schemas.params,
                params,
                'Params validation failed',
            );
        }

        // Validar query params
        if (schemas?.queryParams) {
            const url = new URL(req.url);
            const queryParams = Object.fromEntries(url.searchParams.entries());
            extendedReq._validatedQuery = await validateData(
                schemas.queryParams,
                queryParams,
                'Query params validation failed',
            );
        }

        // Agregar métodos getter
        extendedReq.getBody = function (): TBody {
            if (!this._validatedBody) {
                throw new Error(
                    'Body not validated. Make sure to include body schema in validation.',
                );
            }
            return this._validatedBody;
        };

        extendedReq.getParams = function (): TParams {
            if (!this._validatedParams) {
                throw new Error(
                    'Params not validated. Make sure to include params schema in validation.',
                );
            }
            return this._validatedParams;
        };

        extendedReq.getQueryParams = function (): TQuery {
            if (!this._validatedQuery) {
                throw new Error(
                    'Query params not validated. Make sure to include queryParams schema in validation.',
                );
            }
            return this._validatedQuery;
        };

        return extendedReq;
    },

    /**
     * Resuelve y valida el input para Server Actions usando Zod schemas
     * @param input - Input a validar
     * @param schema - Schema de validación
     * @returns Input validado
     */
    action: async <TInput = any>(input: any, schema?: z.ZodSchema<TInput>): Promise<TInput> => {
        if (!schema) {
            return input;
        }

        try {
            return await schema.parseAsync(input);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new Error(
                    `Validation Error: ${error.issues.map((e) => e.message).join(', ')}`,
                );
            }
            throw error;
        }
    },
};
