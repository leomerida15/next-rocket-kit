import { z } from 'zod';
import { createRocket, Route, createRoute, zodResolver, generateDocs } from './index';
import { NextResponse } from 'next/server';

// Definir schemas de validación con Zod
const UserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    age: z.number().min(18, 'Must be at least 18 years old'),
});

const QueryParamsSchema = z.object({
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 10)),
});

const ParamsSchema = z.object({
    userId: z.string().uuid('Invalid user ID format'),
});

// Crear instancia de Rocket
const rocket = createRocket({
    resolver: zodResolver, // Usar el zodResolver por defecto
    openApiFormat: 'openapi',
});

// Ejemplo de uso del método Route
export const createUser = rocket.Route({
    handler: async (req, reply) => {
        // Obtener datos validados con tipado automático
        const body = req.getBody(); // Tipado como UserSchema
        const queryParams = req.getQueryParams(); // Tipado como QueryParamsSchema

        // Lógica del handler
        console.log('Creating user:', body);
        console.log('Query params:', queryParams);

        return NextResponse.json(
            {
                success: true,
                user: body,
                message: 'User created successfully',
            },
            { status: 201 },
        );
    },
    schema: {
        body: UserSchema,
        queryParams: QueryParamsSchema,
    },
});

// Ejemplo de uso directo del método Route
export const getUserById = Route({
    handler: async (req, reply) => {
        // Obtener params validados
        const params = req.getParams(); // Tipado como ParamsSchema

        // Lógica del handler
        console.log('Getting user with ID:', params.userId);

        return NextResponse.json({
            success: true,
            userId: params.userId,
            user: {
                id: params.userId,
                name: 'John Doe',
                email: 'john@example.com',
            },
        });
    },
    schema: {
        params: ParamsSchema,
    },
});

// Ejemplo de uso directo de createRoute con zodResolver
export const createUserWithCustomRoute = createRoute(zodResolver)({
    handler: async (req, reply) => {
        const body = req.getBody();
        const queryParams = req.getQueryParams();

        return NextResponse.json({
            success: true,
            user: body,
            queryParams,
        });
    },
    schema: {
        body: UserSchema,
        queryParams: QueryParamsSchema,
    },
});

// Ejemplo de generación de documentación usando generateDocs directamente
export const generateApiDocs = () => {
    const docsGenerator = generateDocs({
        title: 'My API',
        version: '1.0.0',
        description: 'API documentation for my Next.js application',
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
    });

    return docsGenerator.generate();
};
