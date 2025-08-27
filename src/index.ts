// Exportar todos los componentes principales de la librería
export { createRocket } from './create-rocket';
export { createRoute } from './route';
export { createAction } from './action';
export { zodResolver } from './resolver';
export { zodActionResolver } from './zod-action-resolver';
export { generateDocs, DocumentationGenerator } from './docs';

// Exportar tipos
export type {
    ValidationSchemas,
    RouteHandler,
    RouteConfig,
    Request,
    Reply,
    RocketConfig,
    OpenApiConfig,
    RocketInstance,
} from './types';
