// import { prismaAddGlobalWhere } from "./function/createPrismaAddWhere";
import { PrismaClient } from "@prisma/client";
import { onPrismaParamsOptios } from "./types";
import { prismaAddGlobalWhere } from "./createPrismaAddWhere";

interface Global {
	prisma?: PrismaClient;
}

export const onPrisma = (
	PrismaClientNative: PrismaClient,
	options?: onPrismaParamsOptios,
) => {
	if ((global as Global).prisma) return (global as Global).prisma;

	if (options?.whereGlobal)
		return prismaAddGlobalWhere(new PrismaClientNative(), options?.whereGlobal);

	if (process.env.NODE_ENV !== "production" && !(global as any).prisma) {
		(global as any).prisma = new PrismaClientNative();
	}

	const prisma = (global as Global).prisma || new PrismaClientNative();

	return { prisma };
};
