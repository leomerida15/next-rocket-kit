import { onPrismaParamsOptios, Global } from "./types";
import { prismaAddGlobalWhere } from "./createPrismaAddWhere";

export const onPrisma = <PrismaClient>(
	PrismaClientNative: new () => PrismaClient,
	options?: onPrismaParamsOptios,
) => {
	if ((global as Global<PrismaClient>).prisma) {
		return { prisma: (global as Global<PrismaClient>).prisma };
	}

	if (options?.whereGlobal) {
		const prisma = prismaAddGlobalWhere(
			new PrismaClientNative(),
			options?.whereGlobal,
		);

		(global as Global<PrismaClient>).prisma = prisma;

		return { prisma: (global as Global<PrismaClient>).prisma };
	}

	(global as Global<PrismaClient>).prisma = new PrismaClientNative();

	return { prisma: (global as Global<PrismaClient>).prisma };
};
