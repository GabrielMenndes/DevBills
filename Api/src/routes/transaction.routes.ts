import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import createTransaction from "../controllers/transactions/createTransaction.controller";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionsSummary.controller";
import {
    createTransactionSchema,
    deleteTransactionSchema,
    getTransactionsSchema,
} from "../schemas/transaction.schema";

const transactionRoutes = async (fastify: FastifyInstance) => {
    // Criação
    fastify.route({
        method: "POST",
        url: "/",
        schema: {
            body: zodToJsonSchema(createTransactionSchema),
        },
        handler: createTransaction,
    });

    // Buscar com Filtros

    fastify.route({
        method: "GET",
        url: "/",
        schema: {
            querystring: zodToJsonSchema(getTransactionsSchema),
        },
        handler: getTransactions,
    });

    // Busca o Resumo

    fastify.route({
        method: "GET",
        url: "/summary",
        schema: {
            querystring: zodToJsonSchema(getTransactionsSchema),
        },
        handler: getTransactionsSummary,
    });

    // Deltar

    fastify.route({
        method: "DELETE",
        url: "/:id",
        schema: {
            params: zodToJsonSchema(deleteTransactionSchema),
        },
        handler: deleteTransaction,
    });
};

export default transactionRoutes;
