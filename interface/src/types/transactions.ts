import type { Category, CategorySummary } from "./category";

export type TransactionType = "income" | "expense";

export const TransactionType = {
  INCOME: "income" as const,
  EXPENSE: "expense" as const,
};

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  date: string | Date;
  categoryId: string;
  category: Category;
  type: TransactionType;
  updatedAt: string | Date;
  createdAt: string | Date;
}

export interface TransactionFilter {
  month: number;
  year: number;
  categoryId?: string;
  type?: TransactionType;
}

export interface TransactionSummary {
  totalIncomes: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: CategorySummary[];
}

export interface MonthlyItem {
  name: string;
  expenses: number;
  income: number;
}