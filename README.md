# @rocket-kit/next Documentation

A powerful Next.js API toolkit that provides type-safe route handlers and server actions with Zod validation, eliminating the need for manual request parsing and validation.

## 🚀 Getting Started

### Installation

```bash
npm install @rocket-kit/next @rocket-kit/next-resolver-zod zod
```

### Basic Setup

```typescript
import { createRocket } from '@rocket-kit/next';
import { zodResolver } from '@rocket-kit/next-resolver-zod';

const rocket = createRocket({
    resolver: zodResolver,
});
```

## ⚙️ createRocket

The `createRocket` function is the main entry point of the library. It creates a Rocket instance with the specified resolver for validation.

### Parameters

- `config.resolver`: The validation resolver to use (e.g., `zodResolver`)
- `config.openApiFormat` (optional): Format for OpenAPI documentation ('swagger' | 'openapi')

### Example

```typescript
import { createRocket } from '@rocket-kit/next';
import { zodResolver } from '@rocket-kit/next-resolver-zod';

const rocket = createRocket({
    resolver: zodResolver,
    openApiFormat: 'openapi',
});
```

## 🛣️ Route Function

The `Route` function creates type-safe API route handlers with automatic validation and parsing.

### Basic Usage

```typescript
import { rocket } from './rocket-config';
import { z } from 'zod';

const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
});

export const POST = rocket.Route({
    schema: {
        body: userSchema,
    },
    handler: async (req, reply) => {
        const body = req.getBody(); // Type-safe body
        const params = req.getParams(); // Type-safe params
        const query = req.getQueryParams(); // Type-safe query params

        // Your logic here
        return reply.json({ success: true, data: body });
    },
});
```

### Schema Configuration

The `schema` object accepts three optional properties:

- `body`: Zod schema for request body validation
- `params`: Zod schema for route parameters validation
- `queryParams`: Zod schema for query parameters validation

### Request Methods

The extended request object provides three main methods:

#### `getBody()`

Returns the validated and parsed request body.

```typescript
const body = req.getBody(); // Returns TBody
```

#### `getParams()`

Returns the validated route parameters.

```typescript
const params = req.getParams(); // Returns TParams
```

#### `getQueryParams()`

Returns the validated query parameters.

```typescript
const query = req.getQueryParams(); // Returns TQuery
```

### Complete Route Example

```typescript
import { rocket } from './rocket-config';
import { z } from 'zod';

const createUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    age: z.number().min(18),
});

const userParamsSchema = z.object({
    id: z.string().uuid(),
});

const userQuerySchema = z.object({
    include: z.enum(['profile', 'posts']).optional(),
});

export const POST = rocket.Route({
    schema: {
        body: createUserSchema,
        params: userParamsSchema,
        queryParams: userQuerySchema,
    },
    handler: async (req, reply) => {
        const body = req.getBody(); // { name: string, email: string, age: number }
        const params = req.getParams(); // { id: string }
        const query = req.getQueryParams(); // { include?: 'profile' | 'posts' }

        // All data is type-safe and validated
        const user = await createUser(body);

        return reply.json({ success: true, user });
    },
});
```

## ⚡ Action Function

The `Action` function creates type-safe server actions with automatic validation.

### Basic Usage

```typescript
import { rocket } from './rocket-config';
import { z } from 'zod';

const createPostSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(10),
});

export const createPost = rocket.Action({
    schema: createPostSchema,
    handler: async (input) => {
        // input is type-safe and validated
        const post = await db.posts.create(input);
        return post;
    },
});
```

### Action without Schema

```typescript
export const simpleAction = rocket.Action({
    handler: async (input) => {
        // input is any type when no schema is provided
        return { message: 'Success' };
    },
});
```

## 🔧 Zod Integration

@rocket-kit/next is built with Zod v4 and provides seamless integration for type-safe validation.

### What are Resolvers?

Resolvers are functions that handle the validation and parsing of incoming data. They take raw input and a schema, then return validated and typed data.

### zodResolver

The `zodResolver` is the primary resolver that uses Zod schemas for validation.

```typescript
import { zodResolver } from '@rocket-kit/next-resolver-zod';

const rocket = createRocket({
    resolver: zodResolver,
});
```

### Custom Resolvers

You can create custom resolvers for different validation libraries:

```typescript
import { ResolverFunction } from '@rocket-kit/next';

const customResolver: ResolverFunction = {
    route: async (req, schemas) => {
        // Custom validation logic
        return extendedReq;
    },
    action: async (input, schema) => {
        // Custom validation logic
        return validatedInput;
    },
};

const rocket = createRocket({
    resolver: customResolver,
});
```

### Zod Schema Examples

```typescript
import { z } from 'zod';

// Basic validation
const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    age: z.number().min(18).max(120),
});

// Complex validation
const orderSchema = z.object({
    items: z.array(
        z.object({
            id: z.string().uuid(),
            quantity: z.number().positive(),
            price: z.number().positive(),
        }),
    ),
    shipping: z.object({
        address: z.string(),
        city: z.string(),
        country: z.string(),
    }),
    payment: z.object({
        method: z.enum(['credit_card', 'paypal']),
        cardNumber: z
            .string()
            .regex(/^\d{16}$/)
            .optional(),
    }),
});

// Conditional validation
const conditionalSchema = z
    .object({
        type: z.enum(['individual', 'company']),
        name: z.string(),
        email: z.string().email(),
        companyName: z.string().optional(),
        taxId: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.type === 'company') {
                return data.companyName && data.taxId;
            }
            return true;
        },
        {
            message: 'Company name and tax ID are required for company accounts',
        },
    );
```

## 📝 Examples

### Complete API Route Example

```typescript
// app/api/users/[id]/posts/route.ts
import { rocket } from '@/lib/rocket-config';
import { z } from 'zod';

const createPostSchema = z.object({
    title: z.string().min(1).max(100),
    content: z.string().min(10),
    tags: z.array(z.string()).optional(),
});

const postParamsSchema = z.object({
    id: z.string().uuid(),
});

const postQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    sort: z.enum(['created_at', 'title']).default('created_at'),
});

export const POST = rocket.Route({
    schema: {
        body: createPostSchema,
        params: postParamsSchema,
        queryParams: postQuerySchema,
    },
    handler: async (req, reply) => {
        const body = req.getBody();
        const params = req.getParams();
        const query = req.getQueryParams();

        const post = await createPost({
            ...body,
            userId: params.id,
        });

        return reply.json({ success: true, post });
    },
});

export const GET = rocket.Route({
    schema: {
        params: postParamsSchema,
        queryParams: postQuerySchema,
    },
    handler: async (req, reply) => {
        const params = req.getParams();
        const query = req.getQueryParams();

        const posts = await getPosts({
            userId: params.id,
            page: query.page,
            limit: query.limit,
            sort: query.sort,
        });

        return reply.json({ success: true, posts });
    },
});
```

### Server Action Example

```typescript
// app/actions/user-actions.ts
import { rocket } from '@/lib/rocket-config';
import { z } from 'zod';

const updateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    bio: z.string().max(500).optional(),
    avatar: z.string().url().optional(),
});

export const updateProfile = rocket.Action({
    schema: updateProfileSchema,
    handler: async (input) => {
        const userId = await getCurrentUserId();
        const updatedUser = await updateUser(userId, input);
        return updatedUser;
    },
});

const deleteAccountSchema = z.object({
    password: z.string().min(8),
    confirm: z.literal('DELETE'),
});

export const deleteAccount = rocket.Action({
    schema: deleteAccountSchema,
    handler: async (input) => {
        if (input.confirm !== 'DELETE') {
            throw new Error('Confirmation required');
        }

        const userId = await getCurrentUserId();
        await deleteUser(userId, input.password);
        return { success: true };
    },
});
```

### Error Handling

```typescript
export const POST = rocket.Route({
    schema: {
        body: userSchema,
    },
    handler: async (req, reply) => {
        try {
            const body = req.getBody();
            const user = await createUser(body);
            return reply.json({ success: true, user });
        } catch (error) {
            if (error instanceof ValidationError) {
                return reply.json(
                    { error: 'Validation failed', details: error.details },
                    { status: 400 },
                );
            }

            return reply.json({ error: 'Internal server error' }, { status: 500 });
        }
    },
});
```

### TypeScript Benefits

```typescript
// Full type inference
const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    age: z.number(),
});

type User = z.infer<typeof userSchema>; // Automatically inferred

export const POST = rocket.Route({
    schema: {
        body: userSchema,
    },
    handler: async (req, reply) => {
        const body = req.getBody(); // Type: User
        // TypeScript will provide full IntelliSense
        console.log(body.name); // ✅ Type-safe
        console.log(body.email); // ✅ Type-safe
        console.log(body.age); // ✅ Type-safe
        // console.log(body.invalid); // ❌ TypeScript error
    },
});
```

---

## 🎯 Key Benefits

- **🔒 Type Safety**: Full TypeScript support with automatic type inference
- **✅ Validation**: Automatic request validation using Zod v4
- **🚀 Performance**: Zero runtime overhead for type checking
- **📚 Documentation**: Built-in OpenAPI documentation generation
- **🛠️ Developer Experience**: Excellent IntelliSense and error messages
- **🔧 Flexibility**: Support for custom resolvers and validation libraries

## 📦 Package Information

- **Version**: 2.0.2
- **License**: MIT
- **Repository**: [GitHub](https://github.com/leomerida15/next-rocket-kit)
- **NPM**: [@rocket-kit/next](https://www.npmjs.com/package/@rocket-kit/next)
