import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    PORT: z.string().transform(Number).default("3001"),
    DATABASE_URL: z.string().min(5, "DATABASE_URL é Obrigatório"),
    NODE_ENV: z.enum(["dev", "prod", "test"], {
        message: "NODE_ENV deve ser 'dev', 'prod' ou 'test'",
    }),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("Variáveis de ambiente inválidas☢️🚨");
    process.exit(1);
}

export const env = _env.data;
