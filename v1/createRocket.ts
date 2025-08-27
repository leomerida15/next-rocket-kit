import { resolverObj } from './resolvers/resolverObj';
import { ConfigObject, OasKeys } from './types';
import { ResolverKeys } from './resolvers';
export * as Http from 'http-status-codes';
import { createConfig } from './config';
import { Oas } from './docs';

/**
 * CreateRocket: generates a kit to workr back end in next.js with app folder
 *
 */
export const createRocket = <K extends ResolverKeys = 'zod', O extends OasKeys = '3.1'>(
    params?: ConfigObject<K, O>,
) => {
    const config = createConfig(params);

    const Route = resolverObj[config.resolver] as K extends 'yup'
        ? typeof resolverObj.yup
        : typeof resolverObj.zod;

    const onRoute = () => ({ Route });

    const OpenApi = Oas[config.oas];

    return { Route, onRoute, Http, OpenApi, onPrisma };
};
