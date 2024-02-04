export type PrismaClientCustom = new () => any;

export interface Global<PrismaClient extends PrismaClientCustom> {
	prisma?: PrismaClient;
}

export interface onPrismaParamsOptios {
	whereGlobal: object;
}
