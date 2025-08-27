import { createRoute } from './route';
import { createAction } from './action';
import { zodActionResolver } from './zod-action-resolver';
import { RocketConfig, ResolverFunction, RouteConfig } from './types';

/**
 * Función de inicio de la librería Rocket
 * Crea una instancia de Rocket con el resolver y configuración de documentación
 */
export const createRocket = <Rs extends ResolverFunction>(config: RocketConfig<Rs>) => {
    const { resolver } = config;

    // Crear la instancia de Rocket con tipado correcto
    const rocket = {
        /**
         * Método Route que captura todos los métodos del endpoint de Next.js
         */
        Route: <TBody = any, TParams = any, TQuery = any>(
            config: RouteConfig<TBody, TParams, TQuery>,
        ) => {
            return createRoute(resolver)(config);
        },

        /**
         * Método Action para crear Server Actions con validación
         */
        Action: <TInput = any, TOutput = any>(config: {
            handler: (input: TInput) => Promise<TOutput> | TOutput;
            schema?: any;
        }) => {
            return createAction(zodActionResolver)(config);
        },
    };

    return rocket;
};
