import { onPrismaParamsOptios, Global } from "./types";
import { prismaAddGlobalWhere } from "./createPrismaAddWhere";

export const onPrisma = <PrismaClient>(
	PrismaClientNative: new () => PrismaClient,
	options?: onPrismaParamsOptios,
) => {
	if ((global as Global<PrismaClient>).prisma)
		return (global as Global<PrismaClient>).prisma;

	if (options?.whereGlobal)
		return prismaAddGlobalWhere(new PrismaClientNative(), options?.whereGlobal);

	if (process.env.NODE_ENV !== "production" && !(global as any).prisma) {
		(global as any).prisma = new PrismaClientNative();
	}

	const prisma =
		(global as Global<PrismaClient>).prisma || new PrismaClientNative();

	return { prisma };
};
