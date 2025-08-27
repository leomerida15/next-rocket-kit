import { Route } from 'next-rocket-kit';
import { schemas } from './user-schema';

/**
 * GET /api/users
 * Get list of users with pagination and filtering
 */
export const GET = Route({
    schemas: {
        query: schemas.UserQuery,
        response: schemas.UserListResponse,
    },
    metadata: {
        summary: 'Get users',
        description: 'Retrieve a paginated list of users with optional filtering',
        tags: ['users'],
        operationId: 'getUsers',
    },
    handler: async (req, reply) => {
        const query = req.getQuery();

        // Simulate database query
        const users = [
            {
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'John Doe',
                email: 'john@example.com',
                age: 30,
                isActive: true,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
                profile: {
                    bio: 'Software developer',
                    avatar: 'https://example.com/avatar.jpg',
                },
            },
        ];

        return reply.json({
            users,
            total: 1,
            page: parseInt(query.page || '1'),
            limit: parseInt(query.limit || '10'),
        });
    },
});

/**
 * POST /api/users
 * Create a new user
 */
export const POST = Route({
    schemas: {
        body: schemas.CreateUser,
        response: schemas.UserResponse,
    },
    metadata: {
        summary: 'Create user',
        description: 'Create a new user in the system',
        tags: ['users'],
        operationId: 'createUser',
    },
    handler: async (req, reply) => {
        const body = await req.getBody();

        // Simulate user creation
        const newUser = {
            id: '123e4567-e89b-12d3-a456-426614174001',
            ...body,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            profile: {
                bio: body.bio || '',
                avatar: body.avatar || '',
            },
        };

        return reply.json(newUser, { status: 201 });
    },
});
