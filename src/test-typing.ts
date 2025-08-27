import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createRocket, zodResolver } from './index';

// Definir un schema con tipos específicos
const UserSchema = z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
});

const QuerySchema = z.object({
    page: z.string().transform((val) => parseInt(val)),
    limit: z.string().transform((val) => parseInt(val)),
});

const ParamsSchema = z.object({
    userId: z.string().uuid(),
});

// Crear instancia de Rocket
const rocket = createRocket({
    resolver: zodResolver,
});

// Crear una ruta con tipado completo
export const createUser = rocket.Route({
    schema: {
        body: UserSchema,
        queryParams: QuerySchema,
        params: ParamsSchema,
    },
    handler: async (req, reply) => {
        // Estos deberían tener tipado correcto
        const body = req.getBody(); // { name: string, age: number, email: string }
        const query = req.getQueryParams(); // { page: number, limit: number }
        const params = req.getParams(); // { userId: string }

        // Verificar que el tipado funciona
        console.log(body.name); // ✅ string
        console.log(body.age); // ✅ number
        console.log(body.email); // ✅ string

        console.log(query.page); // ✅ number
        console.log(query.limit); // ✅ number

        console.log(params.userId); // ✅ string

        return NextResponse.json({
            success: true,
            user: body,
            query,
            params,
        });
    },
});

// Crear una ruta solo con body
export const updateUser = rocket.Route({
    schema: {
        body: UserSchema,
    },
    handler: async (req, reply) => {
        const body = req.getBody(); // { name: string, age: number, email: string }

        // Solo body está tipado, los otros métodos lanzarán error
        console.log(body.name); // ✅ string

        return NextResponse.json({
            success: true,
            user: body,
        });
    },
});
