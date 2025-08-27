import { z } from 'zod';
import { ValidationResolver } from './action';

/**
 * Resolver específico para Zod que valida el input usando schemas de Zod
 */
export const zodActionResolver: ValidationResolver<any, z.ZodSchema<any>> = async (
    input: any,
    schema?: z.ZodSchema<any>,
) => {
    if (!schema) {
        return input;
    }

    try {
        return await schema.parseAsync(input);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Validation Error: ${error.issues.map((e) => e.message).join(', ')}`);
        }
        throw error;
    }
};
