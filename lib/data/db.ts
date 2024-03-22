import { PrismaClient } from "@prisma/client";

const prismaClient = () => {
	return new PrismaClient();
};

type prismaClient = ReturnType<typeof prismaClient>;

const prismaGlobal = globalThis as unknown as {
	prisma: prismaClient | undefined;
};

export const db = prismaGlobal.prisma ?? prismaClient();

if (process.env.NODE_ENV !== "production") prismaGlobal.prisma = db;
