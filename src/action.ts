// Función que crea Route con resolver dinámico
// Tipo para el handler de Server Action
export type ActionHandler<TInput = any, TOutput = any> = (
    input: TInput,
) => Promise<TOutput> | TOutput;

// Tipo para la configuración de Action genérica
export interface ActionConfig<TInput = any, TOutput = any, TSchema = any> {
    handler: ActionHandler<TInput, TOutput>;
    schema?: TSchema;
}

// Tipo para el resolver de validación
export type ValidationResolver<TInput = any, TSchema = any> = (
    input: any,
    schema?: TSchema,
) => Promise<TInput>;

// Función que crea Action con resolver dinámico
export const createAction = <TResolver extends ValidationResolver = any>(resolver?: TResolver) => {
    return <TInput = any, TOutput = any, TSchema = any>(
        config: ActionConfig<TInput, TOutput, TSchema>,
    ): ActionHandler<TInput, TOutput> => {
        return async (input: any): Promise<TOutput> => {
            // Si hay resolver y schema, validar el input
            if (resolver && config.schema) {
                const validatedInput = await resolver(input, config.schema);
                return await config.handler(validatedInput);
            }

            // Si no hay resolver o schema, usar el input directamente
            return await config.handler(input as TInput);
        };
    };
};
