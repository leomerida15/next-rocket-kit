import { OpenApiConfig } from './types';

/**
 * Módulo de documentación para generar OpenAPI/Swagger
 */
export class DocumentationGenerator {
    private config: OpenApiConfig;
    private paths: Record<string, any> = {};
    private schemas: Record<string, any> = {};

    constructor(config: OpenApiConfig) {
        this.config = config;
    }

    /**
     * Agregar una ruta a la documentación
     */
    addPath(
        path: string,
        method: string,
        summary: string,
        description?: string,
        requestBody?: any,
        responses?: Record<string, any>,
    ) {
        if (!this.paths[path]) {
            this.paths[path] = {};
        }

        this.paths[path][method.toLowerCase()] = {
            summary,
            description,
            ...(requestBody && { requestBody }),
            responses: responses || {
                '200': {
                    description: 'Successful response',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                            },
                        },
                    },
                },
                '400': {
                    description: 'Bad Request',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        };
    }

    /**
     * Agregar un schema a la documentación
     */
    addSchema(name: string, schema: any) {
        this.schemas[name] = schema;
    }

    /**
     * Generar la documentación OpenAPI
     */
    generate(): any {
        return {
            openapi: '3.0.0',
            info: {
                title: this.config.title,
                version: this.config.version,
                description: this.config.description,
            },
            servers: this.config.servers || [
                {
                    url: 'http://localhost:3000',
                    description: 'Development server',
                },
            ],
            paths: this.paths,
            components: {
                schemas: this.schemas,
            },
        };
    }

    /**
     * Generar la documentación en formato Swagger 2.0
     */
    generateSwagger(): any {
        const openApi = this.generate();

        // Convertir de OpenAPI 3.0 a Swagger 2.0
        return {
            swagger: '2.0',
            info: openApi.info,
            host: openApi.servers?.[0]?.url?.replace(/^https?:\/\//, '') || 'localhost:3000',
            basePath: '/',
            schemes: ['http', 'https'],
            paths: this.convertPathsToSwagger(openApi.paths),
            definitions: openApi.components?.schemas || {},
        };
    }

    private convertPathsToSwagger(paths: Record<string, any>): Record<string, any> {
        const swaggerPaths: Record<string, any> = {};

        for (const [path, methods] of Object.entries(paths)) {
            swaggerPaths[path] = {};

            for (const [method, operation] of Object.entries(methods)) {
                swaggerPaths[path][method] = {
                    summary: operation.summary,
                    description: operation.description,
                    ...(operation.requestBody && {
                        parameters: this.convertRequestBodyToParameters(operation.requestBody),
                    }),
                    responses: this.convertResponsesToSwagger(operation.responses),
                };
            }
        }

        return swaggerPaths;
    }

    private convertRequestBodyToParameters(requestBody: any): any[] {
        // Implementación básica de conversión
        return [];
    }

    private convertResponsesToSwagger(responses: Record<string, any>): Record<string, any> {
        const swaggerResponses: Record<string, any> = {};

        for (const [code, response] of Object.entries(responses)) {
            swaggerResponses[code] = {
                description: response.description,
                schema: response.content?.['application/json']?.schema || { type: 'object' },
            };
        }

        return swaggerResponses;
    }
}

/**
 * Función helper para generar documentación
 */
export function generateDocs(config: OpenApiConfig): DocumentationGenerator {
    return new DocumentationGenerator(config);
}
