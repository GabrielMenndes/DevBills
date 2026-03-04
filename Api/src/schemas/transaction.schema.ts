import { TransactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import { z } from "zod";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionSchema = z.object({
    description: z.string().min(1, "A descrição é obrigatória"),
    amount: z.number().positive("O valor deve ser positivo"),
    date: z.coerce.date({
        errorMap: () => ({ message: "A data é obrigatória e deve ser válida" }),
    }),
    categoryId: z.string().refine(isValidObjectId, {
        message: "Categoria Inválida",
    }),
    type: z.enum([TransactionType.expense, TransactionType.income], {
        errorMap: () => ({ message: "O tipo deve ser 'expense' ou 'income'" }),
    }),
});

export const getTransactionsSchema = z.object({
    month: z.string().optional(),
    year: z.string().optional(),
    type: z
        .enum([TransactionType.expense, TransactionType.income], {
            errorMap: () => ({ message: "O tipo deve ser 'expense' ou 'income'" }),
        })
        .optional(),
    categoryId: z
        .string()
        .refine(isValidObjectId, {
            message: "Categoria Inválida",
        })
        .optional(),
});
export const getTransactionsSummarySchema = z.object({
    month: z.string({ message: "O mês é obrigatório" }),
    year: z.string({ message: "O ano é obrigatório" }),
});

export const deleteTransactionSchema = z.object({
    id: z.string().refine(isValidObjectId, {
        message: "ID de transação inválido",
    }),
});

export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type GetTransactionsSummaryQuery = z.infer<typeof getTransactionsSummarySchema>;
export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>;
