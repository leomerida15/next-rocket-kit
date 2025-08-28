import { RouteConfig, RouteHandler, Request, Reply, ResolverFunction } from './types';

// Función que crea Route con resolver dinámico
export const createRoute = <
    TResolver extends ResolverFunction['route'] = ResolverFunction['route'],
>(
    resolver: TResolver,
) => {
    return <TBody = any, TParams = any, TQuery = any>(
        config: RouteConfig<TBody, TParams, TQuery>,
    ): RouteHandler<TBody, TParams, TQuery> => {
        return async (req: any, reply: Reply): Promise<any> => {
            try {
                // Usar el resolver proporcionado para validar y extender el request
                const extendedReq = await resolver<TBody, TParams, TQuery>(req, config.schema);

                // Ejecutar el handler con el request extendido
                const result = await config.handler(extendedReq, reply);

                return result;
            } catch (error) {
                // Manejar errores de validación
                if (error instanceof Error) {
                    return new Response(
                        JSON.stringify({
                            error: 'Validation Error',
                            message: error.message,
                        }),
                        { status: 400, headers: { 'Content-Type': 'application/json' } },
                    );
                }

                // Manejar otros errores
                return new Response(
                    JSON.stringify({
                        error: 'Internal Server Error',
                        message: 'An unexpected error occurred',
                    }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } },
                );
            }
        };
    };
};
