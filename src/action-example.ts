import { z } from 'zod';
import { createRocket, createAction, zodActionResolver, zodResolver } from './index';

// Definir schemas para validación
const CreateUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    age: z.number().min(18, 'Must be at least 18 years old'),
});

const UpdateUserSchema = z.object({
    id: z.string().uuid('Invalid user ID'),
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    age: z.number().min(18).optional(),
});

const DeleteUserSchema = z.object({
    id: z.string().uuid('Invalid user ID'),
});

// Crear instancia de Rocket (necesita importar zodResolver)
const rocket = createRocket({
    resolver: zodResolver,
});

// Ejemplo 1: Server Action con validación usando rocket.Action
export const createUserAction = rocket.Action({
    schema: CreateUserSchema,
    handler: async (input) => {
        // input está tipado como { name: string, email: string, age: number }
        console.log('Creating user:', input.name, input.email, input.age);

        // Simular creación de usuario
        const user = {
            id: 'user-123',
            ...input,
            createdAt: new Date(),
        };

        return { success: true, user };
    },
});

// Ejemplo 2: Server Action con validación usando createAction directamente
export const updateUserAction = createAction(zodActionResolver)({
    schema: UpdateUserSchema,
    handler: async (input) => {
        // input está tipado como { id: string, name?: string, email?: string, age?: number }
        console.log('Updating user:', input.id);

        // Simular actualización de usuario
        const updatedUser = {
            id: input.id,
            name: input.name || 'Unknown',
            email: input.email || 'unknown@example.com',
            age: input.age || 0,
            updatedAt: new Date(),
        };

        return { success: true, user: updatedUser };
    },
});

// Ejemplo 3: Server Action sin validación
export const deleteUserAction = createAction()({
    handler: async (input: { id: string }) => {
        // input no está validado, pero está tipado
        console.log('Deleting user:', input.id);

        // Simular eliminación de usuario
        return { success: true, message: `User ${input.id} deleted` };
    },
});

// Ejemplo 4: Server Action con createAction personalizado
export const customCreateAction = createAction()({
    schema: CreateUserSchema,
    handler: async (input) => {
        // input está validado y tipado
        console.log('Custom action creating user:', input);

        return { success: true, message: 'User created with custom action' };
    },
});

// Ejemplo de uso en un componente React
export const useUserActions = () => {
    const handleCreateUser = async (formData: FormData) => {
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            age: parseInt(formData.get('age') as string),
        };

        try {
            const result = await createUserAction(data);
            console.log('User created:', result);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleUpdateUser = async (formData: FormData) => {
        const data = {
            id: formData.get('id') as string,
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            age: parseInt(formData.get('age') as string),
        };

        try {
            const result = await updateUserAction(data);
            console.log('User updated:', result);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return {
        createUser: handleCreateUser,
        updateUser: handleUpdateUser,
        deleteUser: deleteUserAction,
    };
};
