# @rocket-kit/next Documentation

A powerful Next.js toolkit for building type-safe APIs with Zod validation and OpenAPI documentation.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Resolvers](#resolvers)
- [Examples](#examples)

## Installation

```bash
npm install @rocket-kit/next zod@^4.1.4
```

## Quick Start

```typescript
import { createRocket } from '@rocket-kit/next';
import { zodResolver } from '@rocket-kit/next/resolvers';
import { z } from 'zod';

// Create a Rocket instance with Zod resolver
const rocket = createRocket({
    resolver: zodResolver,
});

// Define your schemas
const UserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    age: z.number().min(18),
});

// Create a route with validation
const userRoute = rocket.Route({
    schema: {
        body: UserSchema,
        params: z.object({ id: z.string() }),
        queryParams: z.object({ include: z.string().optional() }),
    },
    handler: async (req, reply) => {
        const body = req.getBody(); // Type-safe validated body
        const params = req.getParams(); // Type-safe validated params
        const query = req.getQueryParams(); // Type-safe validated query params

        return reply.json({ success: true, data: body });
    },
});
```

## API Reference

### createRocket

The main function to create a Rocket instance with a custom resolver.

```typescript
const rocket = createRocket({
    resolver: zodResolver, // or any custom resolver
});
```

**Parameters:**

- `config.resolver`: A resolver function that handles validation and request processing

### Route

Creates a type-safe route handler with optional validation schemas.

```typescript
const route = rocket.Route<TBody, TParams, TQuery>({
  schema?: {
    body?: z.ZodSchema<TBody>;
    params?: z.ZodSchema<TParams>;
    queryParams?: z.ZodSchema<TQuery>;
  },
  handler: (req: Request<TBody, TParams, TQuery>, reply: Reply) => Promise<NextResponse>
});
```

**Schema Methods:**

#### getBody()

Returns the validated request body with full type safety.

```typescript
const body = req.getBody(); // Returns TBody
```

#### getParams()

Returns the validated route parameters with full type safety.

```typescript
const params = req.getParams(); // Returns TParams
```

#### getQueryParams()

Returns the validated query parameters with full type safety.

```typescript
const query = req.getQueryParams(); // Returns TQuery
```

### Action

Creates a type-safe Server Action with optional validation.

```typescript
const action = rocket.Action<TInput, TOutput>({
  schema?: z.ZodSchema<TInput>;
  handler: (input: TInput) => Promise<TOutput> | TOutput;
});
```

## Resolvers

Resolvers are functions that handle validation and request processing. They provide a way to customize how your requests are validated and processed.

### zodResolver

The built-in Zod resolver that integrates with Zod v4 for schema validation.

```typescript
import { zodResolver } from '@rocket-kit/next/resolvers';

const rocket = createRocket({
    resolver: zodResolver,
});
```

**What are Resolvers?**

Resolvers are middleware functions that:

- Parse and validate incoming requests
- Transform request data according to schemas
- Provide type-safe access to validated data
- Handle validation errors gracefully

The `zodResolver` specifically:

- Uses Zod v4 for schema validation
- Automatically parses JSON bodies
- Validates route parameters and query strings
- Provides detailed error messages for validation failures

## Examples

### Basic Route

A simple route without validation:

```typescript
import { createRocket } from '@rocket-kit/next';
import { zodResolver } from '@rocket-kit/next/resolvers';

const rocket = createRocket({
    resolver: zodResolver,
});

const helloRoute = rocket.Route({
    handler: async (req, reply) => {
        return reply.json({ message: 'Hello World!' });
    },
});

// In your Next.js API route
export const GET = helloRoute;
export const POST = helloRoute;
```

### Route with Validation

A route with comprehensive validation:

```typescript
import { createRocket } from '@rocket-kit/next';
import { zodResolver } from '@rocket-kit/next/resolvers';
import { z } from 'zod';

const rocket = createRocket({
    resolver: zodResolver,
});

// Define validation schemas
const CreateUserSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    age: z.number().int().min(18).max(120),
    preferences: z
        .object({
            newsletter: z.boolean().default(false),
            theme: z.enum(['light', 'dark']).default('light'),
        })
        .optional(),
});

const UserParamsSchema = z.object({
    id: z.string().uuid(),
});

const UserQuerySchema = z.object({
    include: z.enum(['profile', 'posts']).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

const userRoute = rocket.Route({
    schema: {
        body: CreateUserSchema,
        params: UserParamsSchema,
        queryParams: UserQuerySchema,
    },
    handler: async (req, reply) => {
        // All data is type-safe and validated
        const userData = req.getBody(); // Type: { name: string, email: string, age: number, preferences?: {...} }
        const { id } = req.getParams(); // Type: { id: string }
        const { include, limit } = req.getQueryParams(); // Type: { include?: 'profile' | 'posts', limit: number }

        // Your business logic here
        const newUser = await createUser(userData);

        return reply.json({
            success: true,
            data: newUser,
            message: `User ${userData.name} created successfully`,
        });
    },
});

// In your Next.js API route: app/api/users/[id]/route.ts
export const POST = userRoute;
```

### Server Action

A type-safe Server Action with validation:

```typescript
import { createRocket } from '@rocket-kit/next';
import { zodResolver } from '@rocket-kit/next/resolvers';
import { z } from 'zod';

const rocket = createRocket({
  resolver: zodResolver
});

// Define the input schema
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().default(false)
});

// Create the action
const loginAction = rocket.Action({
  schema: LoginSchema,
  handler: async (input) => {
    // input is fully typed and validated
    const { email, password, rememberMe } = input;

    // Your authentication logic here
    const user = await authenticateUser(email, password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token: generateToken(user, rememberMe)
    };
  }
});

// In your component
export default function LoginForm() {
  return (
    <form action={loginAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <input name="rememberMe" type="checkbox" />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Complete Example

A complete example showing both Route and Action usage:

```typescript
// lib/rocket.ts
import { createRocket } from '@rocket-kit/next';
import { zodResolver } from '@rocket-kit/next/resolvers';
import { z } from 'zod';

export const rocket = createRocket({
    resolver: zodResolver,
});

// Schemas
export const ProductSchema = z.object({
    name: z.string().min(1).max(100),
    price: z.number().positive(),
    description: z.string().optional(),
    category: z.enum(['electronics', 'clothing', 'books']),
    inStock: z.boolean().default(true),
});

export const ProductUpdateSchema = ProductSchema.partial();

export const ProductParamsSchema = z.object({
    id: z.string().uuid(),
});

export const ProductQuerySchema = z.object({
    category: z.enum(['electronics', 'clothing', 'books']).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    inStock: z.coerce.boolean().optional(),
});

// Routes
export const createProductRoute = rocket.Route({
    schema: {
        body: ProductSchema,
    },
    handler: async (req, reply) => {
        const productData = req.getBody();
        const newProduct = await createProduct(productData);

        return reply.json({
            success: true,
            data: newProduct,
        });
    },
});

export const updateProductRoute = rocket.Route({
    schema: {
        body: ProductUpdateSchema,
        params: ProductParamsSchema,
    },
    handler: async (req, reply) => {
        const updates = req.getBody();
        const { id } = req.getParams();

        const updatedProduct = await updateProduct(id, updates);

        return reply.json({
            success: true,
            data: updatedProduct,
        });
    },
});

export const getProductsRoute = rocket.Route({
    schema: {
        queryParams: ProductQuerySchema,
    },
    handler: async (req, reply) => {
        const filters = req.getQueryParams();
        const products = await getProducts(filters);

        return reply.json({
            success: true,
            data: products,
        });
    },
});

// Actions
export const deleteProductAction = rocket.Action({
    schema: z.object({ id: z.string().uuid() }),
    handler: async (input) => {
        const { id } = input;
        await deleteProduct(id);

        return { success: true, message: 'Product deleted successfully' };
    },
});

export const toggleProductStockAction = rocket.Action({
    schema: z.object({
        id: z.string().uuid(),
        inStock: z.boolean(),
    }),
    handler: async (input) => {
        const { id, inStock } = input;
        const product = await updateProduct(id, { inStock });

        return {
            success: true,
            data: product,
            message: `Product ${inStock ? 'restocked' : 'marked as out of stock'}`,
        };
    },
});
```

```typescript
// app/api/products/route.ts
import { createProductRoute, getProductsRoute } from '@/lib/rocket';

export const POST = createProductRoute;
export const GET = getProductsRoute;
```

```typescript
// app/api/products/[id]/route.ts
import { updateProductRoute } from '@/lib/rocket';

export const PUT = updateProductRoute;
export const PATCH = updateProductRoute;
```

```typescript
// app/products/page.tsx
'use client';

import { deleteProductAction, toggleProductStockAction } from '@/lib/rocket';

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>

      {/* Delete product form */}
      <form action={deleteProductAction}>
        <input name="id" type="hidden" value="product-id" />
        <button type="submit">Delete Product</button>
      </form>

      {/* Toggle stock form */}
      <form action={toggleProductStockAction}>
        <input name="id" type="hidden" value="product-id" />
        <input name="inStock" type="hidden" value="false" />
        <button type="submit">Mark as Out of Stock</button>
      </form>
    </div>
  );
}
```

## Error Handling

The library automatically handles validation errors and returns appropriate HTTP responses:

```typescript
// Validation errors return 400 Bad Request
{
  "error": "Validation Error",
  "message": "Invalid email format"
}

// Internal errors return 500 Internal Server Error
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Type Safety

All functions are fully typed with TypeScript, providing excellent IDE support and compile-time error checking:

- Request bodies are typed based on your Zod schemas
- Route parameters are validated and typed
- Query parameters are parsed and typed
- Server Action inputs are validated and typed
- Return types are inferred automatically

## Best Practices

1. **Use descriptive schema names**: `UserCreateSchema`, `ProductUpdateSchema`
2. **Keep schemas reusable**: Define schemas separately and compose them
3. **Handle errors gracefully**: The library handles validation errors automatically
4. **Use TypeScript**: Leverage the full type safety provided by the library
5. **Validate early**: Always validate input data before processing
6. **Use meaningful error messages**: Customize error responses when needed

## Migration from Zod v3

If you're migrating from Zod v3 to v4, the main changes are:

- Improved type inference
- Better error messages
- Enhanced performance
- New schema methods

The `zodResolver` is fully compatible with Zod v4 and provides the same API as before.

---

For more information, visit the [GitHub repository](https://github.com/leomerida15/next-rocket-kit).
