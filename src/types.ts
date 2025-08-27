import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export type ResolverFn = <TBody = any, TParams = any, TQuery = any>(
    req: NextRequest,
    schemas?: ValidationSchemas<TBody, TParams, TQuery>,
) => Promise<Request<TBody, TParams, TQuery>>;

// Tipos para los schemas de validación con inferencia de tipos
export interface ValidationSchemas<TBody = any, TParams = any, TQuery = any> {
    body?: z.ZodSchema<TBody>;
    params?: z.ZodSchema<TParams>;
    queryParams?: z.ZodSchema<TQuery>;
}

// Tipo para el handler de la ruta
export interface RouteHandler<TBody = any, TParams = any, TQuery = any> {
    (req: Request<TBody, TParams, TQuery>, reply: Reply): Promise<NextResponse> | NextResponse;
}

// Tipo para la configuración de Route
export interface RouteConfig<TBody = any, TParams = any, TQuery = any> {
    handler: RouteHandler<TBody, TParams, TQuery>;
    schema?: ValidationSchemas<TBody, TParams, TQuery>;
}

// Request extendido con métodos de validación
export interface Request<TBody = any, TParams = any, TQuery = any> extends NextRequest {
    getBody(): TBody;
    getParams(): TParams;
    getQueryParams(): TQuery;
    _validatedBody?: TBody;
    _validatedParams?: TParams;
    _validatedQuery?: TQuery;
}

// Reply como alias de NextResponse
export type Reply = NextResponse;

export type ResolverFunction = {
    route: <TBody = any, TParams = any, TQuery = any>(
        req: NextRequest,
        schemas?: ValidationSchemas<TBody, TParams, TQuery>,
    ) => Promise<Request<TBody, TParams, TQuery>>;
    action: <TInput = any>(input: any, schema?: any) => Promise<TInput>;
};

// Configuración para createRocket
export interface RocketConfig<Rs extends ResolverFunction> {
    resolver: Rs;
    openApiFormat?: 'swagger' | 'openapi';
}

// Tipos para la documentación OpenAPI
export interface OpenApiConfig {
    title: string;
    version: string;
    description?: string;
    servers?: Array<{ url: string; description?: string }>;
}

// Tipo para el resultado de createRocket
export interface RocketInstance {
    Route: <TBody = any, TParams = any, TQuery = any>(
        config: RouteConfig<TBody, TParams, TQuery>,
    ) => RouteHandler<TBody, TParams, TQuery>;
    // generateDocs: (config: OpenApiConfig) => any;
}
