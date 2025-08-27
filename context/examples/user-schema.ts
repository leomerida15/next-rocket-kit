import { z } from 'zod';

/**
 * User entity schema
 * @description Represents a user in the system
 */
export const UserSchema = z.object({
    id: z.string().uuid().describe('Unique user identifier'),
    name: z.string().min(1).max(100).describe('User full name'),
    email: z.string().email().describe('User email address'),
    age: z.number().min(0).max(150).optional().describe('User age'),
    isActive: z.boolean().default(true).describe('Whether the user is active'),
    createdAt: z.date().describe('User creation timestamp'),
    updatedAt: z.date().describe('User last update timestamp'),
});

/**
 * Create user request schema
 * @description Schema for creating a new user
 */
export const CreateUserSchema = UserSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

/**
 * Update user request schema
 * @description Schema for updating an existing user
 */
export const UpdateUserSchema = CreateUserSchema.partial();

/**
 * User response schema
 * @description Schema for user responses
 */
export const UserResponseSchema = UserSchema.extend({
    profile: z
        .object({
            bio: z.string().optional(),
            avatar: z.string().url().optional(),
        })
        .optional(),
});

/**
 * User list response schema
 * @description Schema for user list responses
 */
export const UserListResponseSchema = z.object({
    users: z.array(UserResponseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
});

/**
 * User query parameters schema
 * @description Schema for user query parameters
 */
export const UserQuerySchema = z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
    search: z.string().optional(),
    isActive: z
        .string()
        .transform((val) => val === 'true')
        .optional(),
});

// Export schemas object for OpenAPI generation
export const schemas = {
    User: {
        schema: UserSchema,
        description: 'User entity',
    },
    CreateUser: {
        schema: CreateUserSchema,
        description: 'Create user request',
    },
    UpdateUser: {
        schema: UpdateUserSchema,
        description: 'Update user request',
    },
    UserResponse: {
        schema: UserResponseSchema,
        description: 'User response with profile',
    },
    UserListResponse: {
        schema: UserListResponseSchema,
        description: 'User list response with pagination',
    },
    UserQuery: {
        schema: UserQuerySchema,
        description: 'User query parameters',
    },
};
