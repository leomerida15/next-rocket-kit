# Next Rocket Kit

Una librería moderna para Next.js que simplifica el manejo de rutas API con validación automática usando Zod y generación de documentación OpenAPI/Swagger.

## Características

-   ✅ **Validación automática** con Zod para body, params y query parameters
-   ✅ **Server Actions** con validación automática
-   ✅ **Tipado TypeScript** completo con inferencia automática
-   ✅ **Manejo de errores** integrado
-   ✅ **Documentación automática** OpenAPI/Swagger
-   ✅ **Compatibilidad** con Next.js 15+ y React 19
-   ✅ **API simple** y fácil de usar

## Instalación

```bash
npm install next-rocket-kit zod
# o
bun add next-rocket-kit zod
```

## Uso Básico

### 1. Crear una instancia de Rocket

```typescript
import { createRocket, zodResolver } from 'next-rocket-kit';

const rocket = createRocket({
    resolver: zodResolver, // Usar zodResolver por defecto
    openApiFormat: 'openapi', // o 'swagger'
});
```

### 2. Definir schemas de validación

```typescript
import { z } from 'zod';

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
```

### 3. Crear rutas con validación

```typescript
import { NextResponse } from 'next/server';

export const createUser = rocket.Route({
    handler: async (req, reply) => {
        // Obtener datos validados con tipado automático
        const body = req.getBody(); // Tipado como UserSchema
        const queryParams = req.getQueryParams(); // Tipado como QueryParamsSchema

        // Tu lógica aquí
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

export const getUserById = rocket.Route({
    handler: async (req, reply) => {
        const params = req.getParams(); // Tipado como ParamsSchema

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
```

## Server Actions

### Crear Server Actions con validación

```typescript
import { z } from 'zod';
import { createRocket, createAction, zodActionResolver } from 'next-rocket-kit';

const rocket = createRocket({
    resolver: zodResolver,
});

// Definir schema para validación
const CreateUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    age: z.number().min(18, 'Must be at least 18 years old'),
});

// Server Action con validación usando rocket.Action
export const createUserAction = rocket.Action({
    schema: CreateUserSchema,
    handler: async (input) => {
        // input está tipado como { name: string, email: string, age: number }
        console.log('Creating user:', input.name, input.email, input.age);

        return { success: true, user: input };
    },
});

// Server Action con validación usando createAction directamente
export const updateUserAction = createAction(zodActionResolver)({
    schema: z.object({
        id: z.string().uuid(),
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
    }),
    handler: async (input) => {
        // input está tipado como { id: string, name?: string, email?: string }
        return { success: true, user: input };
    },
});
```

### 4. Usar en Next.js App Router

```typescript
// app/api/users/route.ts
import { createUser } from './handlers';

export const POST = createUser;
```

```typescript
// app/api/users/[userId]/route.ts
import { getUserById } from './handlers';

export const GET = getUserById;
```

## API Reference

### createRocket(config)

Crea una instancia de Rocket con la configuración especificada.

```typescript
interface RocketConfig {
    resolver?: typeof zodResolver; // Resolver personalizado (opcional)
    openApiFormat?: 'swagger' | 'openapi'; // Formato de documentación
}
```

### rocket.Route(config)

Crea una ruta con validación automática.

```typescript
interface RouteConfig<TBody, TParams, TQuery> {
    handler: RouteHandler<TBody, TParams, TQuery>;
    schema?: ValidationSchemas;
}
```

### Request Methods

El objeto `req` extendido incluye estos métodos:

-   `req.getBody()` - Obtiene el body validado
-   `req.getParams()` - Obtiene los parámetros de URL validados
-   `req.getQueryParams()` - Obtiene los query parameters validados

### ValidationSchemas

```typescript
interface ValidationSchemas<TBody = any, TParams = any, TQuery = any> {
    body?: z.ZodSchema<TBody>;
    params?: z.ZodSchema<TParams>;
    queryParams?: z.ZodSchema<TQuery>;
}
```

### ActionConfig

```typescript
interface ActionConfig<TInput = any, TOutput = any, TSchema = any> {
    handler: (input: TInput) => Promise<TOutput> | TOutput;
    schema?: TSchema;
}
```

### ValidationResolver

```typescript
type ValidationResolver<TInput = any, TSchema = any> = (
    input: any,
    schema?: TSchema,
) => Promise<TInput>;
```

## Generación de Documentación

```typescript
const docs = rocket.generateDocs({
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

// Guardar como JSON
console.log(JSON.stringify(docs, null, 2));
```

## Manejo de Errores

La librería maneja automáticamente los errores de validación y retorna respuestas apropiadas:

```json
{
    "error": "Validation Error",
    "message": "Body validation failed: Name must be at least 2 characters, Invalid email format"
}
```

## Ejemplos Avanzados

### Validación Compleja

```typescript
const ComplexSchema = z.object({
    user: z.object({
        profile: z.object({
            avatar: z.string().url().optional(),
            bio: z.string().max(500).optional(),
        }),
        preferences: z.array(z.string()).optional(),
    }),
    metadata: z.record(z.any()).optional(),
});

export const updateUser = rocket.Route({
    handler: async (req, reply) => {
        const body = req.getBody(); // Tipado completo

        return NextResponse.json({ success: true });
    },
    schema: { body: ComplexSchema },
});
```

### Query Parameters con Transformación

```typescript
const SearchSchema = z.object({
    q: z.string().min(1, 'Search query is required'),
    filters: z
        .string()
        .optional()
        .transform((val) => (val ? JSON.parse(val) : {})),
    sort: z.enum(['asc', 'desc']).default('asc'),
});

export const searchUsers = rocket.Route({
    handler: async (req, reply) => {
        const query = req.getQueryParams();
        // query.filters ya está parseado como objeto
        // query.sort tiene valor por defecto 'asc'

        return NextResponse.json({ results: [] });
    },
    schema: { queryParams: SearchSchema },
});
```

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## Changelog

### v2.0.0

-   ✨ Nueva arquitectura modular
-   ✨ Validación automática con Zod
-   ✨ Tipado TypeScript completo
-   ✨ Generación de documentación OpenAPI/Swagger
-   ✨ Manejo de errores mejorado
-   ✨ Compatibilidad con Next.js 15+ y React 19
