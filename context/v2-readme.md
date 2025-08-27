# Next-Rocket-Kit V2 🚀

> **Next.js Rocket Kit V2** - Enhanced API development toolkit with automatic documentation generation

## 🆕 What's New in V2

### ✨ Major Features

-   **Zod v4 Integration** - Full support for the latest Zod features
-   **Automatic Documentation** - CLI tool that generates OpenAPI specs from your schemas
-   **Enhanced Type Safety** - Improved TypeScript support and type inference
-   **Development Experience** - Watch mode for real-time documentation updates
-   **Modular Architecture** - Better organization and extensibility

### 🔧 Core Improvements

-   Enhanced route validation with better error messages
-   Automatic schema parsing and OpenAPI generation
-   Improved request/response handling
-   Better developer experience with CLI tools

## 📦 Installation

```bash
npm install next-rocket-kit@^2.0.0
# or
bun add next-rocket-kit@^2.0.0
```

## 🚀 Quick Start

### 1. Basic Setup

```typescript
// libs/rocket-kit.ts
import { createRocketV2 } from 'next-rocket-kit';

export const { Route, Schema, Http, OpenApi, generateDocs } = createRocketV2({
    resolver: 'zod',
    oas: '3.1',
    docs: {
        autoGenerate: true,
        outputPath: './docs/openapi.json',
    },
});
```

### 2. Create Schema Files

```typescript
// app/api/users/schema.ts
import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(100),
    email: z.string().email(),
    age: z.number().min(0).max(150).optional(),
    isActive: z.boolean().default(true),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const CreateUserSchema = UserSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export const UserResponseSchema = UserSchema.extend({
    profile: z
        .object({
            bio: z.string().optional(),
            avatar: z.string().url().optional(),
        })
        .optional(),
});

// Export for OpenAPI generation
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
        description: 'User response with profile',
    },
};
```

### 3. Create Route Files

```typescript
// app/api/users/route.ts
import { Route } from '@/libs/rocket-kit';
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
        const users = [
            {
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'John Doe',
                email: 'john@example.com',
                age: 30,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        return reply.json(users);
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
        const body = await req.getBody();

        const newUser = {
            id: '123e4567-e89b-12d3-a456-426614174001',
            ...body,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return reply.json(newUser, { status: 201 });
    },
});
```

## 📚 Documentation CLI

### Generate Documentation

```bash
# Generate OpenAPI documentation
rocket-kit docs generate -i ./app -o ./docs/openapi.json

# Generate YAML format
rocket-kit docs generate -i ./app -o ./docs/openapi.yaml -f yaml

# Custom API info
rocket-kit docs generate \
  -i ./app \
  -o ./docs/openapi.json \
  -t "My API" \
  -v "1.0.0" \
  -d "My awesome API documentation"
```

### Watch Mode (Development)

```bash
# Watch for changes and regenerate automatically
rocket-kit docs watch -i ./app -o ./docs/openapi.json

# Custom debounce time
rocket-kit docs watch -i ./app -o ./docs/openapi.json --debounce 1000
```

### Programmatic Usage

```typescript
import { generateDocs, watchDocs } from 'next-rocket-kit';

// Generate documentation
await generateDocs({
    input: './app',
    output: './docs/openapi.json',
    format: 'json',
    title: 'My API',
    version: '1.0.0',
});

// Watch for changes
await watchDocs({
    input: './app',
    output: './docs/openapi.json',
    format: 'json',
    debounce: 500,
});
```

## 🔧 Configuration

### V2 Configuration Object

```typescript
interface V2ConfigObject {
    resolver?: 'zod' | 'yup';
    oas?: '3.0' | '3.1';
    docs?: {
        autoGenerate?: boolean;
        outputPath?: string;
        format?: 'json' | 'yaml';
    };
}
```

### Package.json Scripts

```json
{
    "scripts": {
        "docs:generate": "rocket-kit docs generate -i ./app -o ./docs/openapi.json",
        "docs:watch": "rocket-kit docs watch -i ./app -o ./docs/openapi.json",
        "docs:dev": "rocket-kit docs watch -i ./app -o ./docs/openapi.json --debounce 300"
    }
}
```

## 📋 Schema File Format

### Required Structure

Your `schema.ts` files should follow this pattern:

```typescript
import { z } from 'zod';

// Define your schemas
export const MySchema = z.object({
    // ... schema definition
});

// Export schemas object for OpenAPI generation
export const schemas = {
    MySchema: {
        schema: MySchema,
        description: 'Description of the schema',
    },
};
```

### Supported Schema Types

-   `z.object()` - Object schemas
-   `z.string()` - String schemas with validation
-   `z.number()` - Number schemas with validation
-   `z.boolean()` - Boolean schemas
-   `z.array()` - Array schemas
-   `z.enum()` - Enum schemas
-   `z.union()` - Union schemas
-   `z.optional()` - Optional fields
-   `z.nullable()` - Nullable fields

## 🛣️ Route Configuration

### Route Metadata

```typescript
export const GET = Route({
    schemas: {
        body: MySchema,
        query: QuerySchema,
        params: ParamsSchema,
        response: ResponseSchema,
    },
    metadata: {
        summary: 'Operation summary',
        description: 'Detailed operation description',
        tags: ['tag1', 'tag2'],
        deprecated: false,
        operationId: 'uniqueOperationId',
    },
    handler: async (req, reply) => {
        // Your handler logic
    },
});
```

### Request/Response Handling

```typescript
// Request methods
const body = await req.getBody(); // Get request body
const query = req.getQuery(); // Get query parameters
const params = req.getParams(); // Get path parameters
const headers = req.getHeaders(); // Get headers
const context = req.getContext(); // Get route context

// Response methods
reply.json(data, { status: 200 }); // JSON response
reply.text('Hello', { status: 200 }); // Text response
reply.html('<h1>Hello</h1>'); // HTML response
reply.redirect('/new-path'); // Redirect response
reply.error(new Error('Something went wrong')); // Error response
```

## 🔄 Migration from V1

### Automatic Migration

V2 maintains backward compatibility with V1 APIs. Your existing code should work without changes.

### Manual Migration (Recommended)

1. **Update imports**:

    ```typescript
    // V1
    import { createRocket } from 'next-rocket-kit';

    // V2
    import { createRocketV2 } from 'next-rocket-kit';
    ```

2. **Add schema files**:
   Create `schema.ts` files in your API directories

3. **Add metadata**:
   Add metadata to your routes for better documentation

4. **Use CLI tools**:
   Start using the documentation CLI for automatic OpenAPI generation

### Migration Checklist

-   [ ] Update to V2 imports
-   [ ] Create schema files for your APIs
-   [ ] Add route metadata
-   [ ] Set up documentation generation
-   [ ] Test your APIs
-   [ ] Update your documentation

## 🧪 Testing

### Unit Testing

```typescript
import { Route } from '@/libs/rocket-kit';

describe('User API', () => {
    it('should validate request body', async () => {
        const handler = Route({
            schemas: {
                body: UserSchema,
            },
            handler: async (req, reply) => {
                return reply.json({ success: true });
            },
        });

        const request = new Request('http://localhost/api/users', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: 'John', email: 'invalid-email' }),
        });

        const response = await handler(request, {});
        expect(response.status).toBe(400);
    });
});
```

## 📖 Examples

### Complete API Example

See the `context/examples/` directory for complete examples:

-   `user-schema.ts` - Complete user schema definition
-   `user-route.ts` - Complete user API routes

### Advanced Features

-   **Custom validation**: Use Zod's advanced features
-   **Error handling**: Custom error responses
-   **Middleware**: Request/response middleware
-   **Authentication**: Auth integration
-   **Rate limiting**: Rate limiting support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

-   📖 [Documentation](https://github.com/leomerida15/next-rocket-kit)
-   🐛 [Issues](https://github.com/leomerida15/next-rocket-kit/issues)
-   💬 [Discussions](https://github.com/leomerida15/next-rocket-kit/discussions)

---

**Next-Rocket-Kit V2** - Making Next.js API development faster and more reliable! 🚀
