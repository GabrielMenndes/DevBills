import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import {
    type CreateTransactionInput,
    createTransactionSchema,
} from "../../schemas/transaction.schema";

const createTransaction = async (
    request: FastifyRequest<{ Querystring: CreateTransactionInput }>,
    reply: FastifyReply,
): Promise<void> => {
    const userId = "FED$%1505SE";

    if (!userId) {
        return reply.status(401).send({ error: "Usuário Não esta Autenticado" });
    }

    const result = createTransactionSchema.safeParse(request.body);

    if (!result.success) {
        const errorMessage = result.error.errors[0].message || "Validação Invalida";

        return reply.status(400).send({ error: errorMessage });
    }

    const transaction = result.data;

    try {
        const category = await prisma.category.findFirst({
            where: {
                id: transaction.categoryId,
                type: transaction.type,
            },
        });

        if (!category) {
            return reply.status(400).send({ error: "Categoria Não Encontrada" });
        }

        const parsedDate = new Date(transaction.date);

        const newTransaction = await prisma.transaction.create({
            data: {
                ...transaction,
                userId,
                date: parsedDate,
            },
            include: {
                category: true,
            },
        });

        reply.status(201).send(newTransaction);
    } catch (err) {
        request.log.error(err, "Erro ao criar transação:");
        return reply.status(500).send({ error: "Erro Interno do Servidor" });
    }
};

export default createTransaction;
