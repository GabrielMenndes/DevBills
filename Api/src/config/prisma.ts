import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const prismaConnect = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Conectado ao MongoDB com sucesso!✅");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB: ❌", err);
  }
};

export default prisma;
