# V2 Architecture Design

## Package Structure

### Core Package (`@rocket-kit/core`)

```typescript
// Main entry point
export { createRocket } from './createRocket';
export { Route } from './route';
export { Http } from './http';
export { OpenApi } from './openapi';
export { onPrisma } from './prisma';

// Types
export type { ConfigObject, RouteConfig, SchemaConfig } from './types';
```

### Zod Resolver Package (`@rocket-kit/resolver-zod`)

```typescript
// Zod v4 specific resolver
export { createZodResolver } from './resolver';
export { zodRoute } from './route';
export { zodSchema } from './schema';

// Types
export type { ZodRouteConfig, ZodSchemaConfig } from './types';
```

### Documentation CLI Package (`@rocket-kit/docs-cli`)

```typescript
// CLI commands
export { generateDocs } from './commands/generate';
export { watchDocs } from './commands/watch';
export { parseSchemas } from './parser';

// Types
export type { DocConfig, SchemaFile } from './types';
```

## Core Components

### 1. Route System

```typescript
interface RouteConfig<T = any> {
    schemas?: {
        body?: Schema;
        query?: Schema;
        params?: Schema;
        response?: Schema;
    };
    handler: RouteHandler<T>;
    metadata?: RouteMetadata;
}

interface RouteMetadata {
    summary?: string;
    description?: string;
    tags?: string[];
    deprecated?: boolean;
}
```

### 2. Schema System

```typescript
interface SchemaConfig {
    name: string;
    schema: any; // Zod schema
    description?: string;
    examples?: Record<string, any>;
}

interface SchemaFile {
    path: string;
    schemas: SchemaConfig[];
    imports: string[];
    exports: string[];
}
```

### 3. Documentation Parser

```typescript
interface DocParser {
    parseFile(filePath: string): SchemaFile;
    parseDirectory(dirPath: string): SchemaFile[];
    generateOpenAPI(schemas: SchemaFile[]): OpenAPIObject;
}
```

## File Structure

```
src/
├── core/
│   ├── createRocket.ts
│   ├── route/
│   ├── http/
│   ├── openapi/
│   └── prisma/
├── resolvers/
│   ├── zod/
│   └── yup/
├── docs-cli/
│   ├── commands/
│   ├── parser/
│   └── generator/
└── types/
    ├── core.ts
    ├── route.ts
    └── docs.ts
```

## Integration Points

### 1. Schema.ts Files

```typescript
// app/api/users/schema.ts
import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    email: z.string().email(),
});

export const CreateUserSchema = UserSchema.omit({ id: true });

export const UserResponseSchema = UserSchema.extend({
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Metadata for OpenAPI generation
export const schemas = {
    User: {
        schema: UserSchema,
        description: 'User entity',
    },
    CreateUser: {
        schema: CreateUserSchema,
        description: 'Create user request',
    },
    UserResponse: {
        schema: UserResponseSchema,
        description: 'User response with timestamps',
    },
};
```

### 2. Route Files

```typescript
// app/api/users/route.ts
import { Route } from '@rocket-kit/core';
import { schemas } from './schema';

export const GET = Route({
    schemas: {
        response: schemas.UserResponse,
    },
    metadata: {
        summary: 'Get users',
        description: 'Retrieve a list of users',
        tags: ['users'],
    },
    handler: async (req, reply) => {
        // Handler implementation
    },
});

export const POST = Route({
    schemas: {
        body: schemas.CreateUser,
        response: schemas.UserResponse,
    },
    metadata: {
        summary: 'Create user',
        description: 'Create a new user',
        tags: ['users'],
    },
    handler: async (req, reply) => {
        // Handler implementation
    },
});
```

## CLI Commands

### Generate Documentation

```bash
rocket-kit docs generate --input ./app --output ./docs/openapi.json
```

### Watch Mode

```bash
rocket-kit docs watch --input ./app --output ./docs/openapi.json
```

### Configuration

```json
{
    "rocketKit": {
        "docs": {
            "input": "./app",
            "output": "./docs/openapi.json",
            "format": "json",
            "watch": false,
            "include": ["**/schema.ts"],
            "exclude": ["**/node_modules/**"]
        }
    }
}
```
