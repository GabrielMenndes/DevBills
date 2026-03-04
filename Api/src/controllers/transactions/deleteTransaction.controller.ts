import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { DeleteTransactionParams } from "../../schemas/transaction.schema";

export const deleteTransaction = async (
    request: FastifyRequest<{ Params: DeleteTransactionParams }>,
    reply: FastifyReply,
): Promise<void> => {
    const userId = "FED$%1505SE";
    const { id } = request.params;
    if (!userId) {
        return reply.status(401).send({ error: "Usuário Não esta Autenticado" });
    }

    try {
        const transaction = await prisma.transaction.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!transaction) {
            return reply.status(404).send({ error: "Transação ou Id Não Encontrada" });
        }

        await prisma.transaction.delete({ where: { id } });

        reply.status(200).send({ message: "Transação Deletada com Sucesso" });
        
    } catch (error) {
        request.log.error(error, "Erro ao deletar transação:");
        return reply.status(500).send({ error: "Erro Interno do Servidor" });
    }
};
