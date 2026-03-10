import { ArrowUp, Calendar, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import Card from "../components/Card";
import MonthYearSelect from "../components/MonthYearSelect";
import { getTransactionsMonthly, getTransactionsSummary } from "../services/transactionService";
import type { MonthlyItem, TransactionSummary } from "../types/transactions";
import { formatCurrency } from "../utils/formatters";

const initialSummary: TransactionSummary = {
  balance: 0,
  totalExpenses: 0,
  totalIncomes: 0,
  expensesByCategory: [],
};

const Dashboard = () => {
  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [summary, setSummary] = useState<TransactionSummary>(initialSummary);
  const [monthlyItemsData, setMonthlyItemsData] = useState<MonthlyItem[]>([]);

  useEffect(() => {
    async function loadTransactionsSumary() {
      const response = await getTransactionsSummary(month, year);

      setSummary(response);
    }
    loadTransactionsSumary();
  }, [month, year]);

  useEffect(() => {
    async function loadTransactionsMonthly() {
      const response = await getTransactionsMonthly(month, year, 4);

      console.log(response);
      setMonthlyItemsData(response.history);
    }
    loadTransactionsMonthly();
  }, [month, year]);

  const renderPieChatLabel = ({ name, percent }: { name?: string; percent?: number }): string => {
    return `${name ?? ""}: ${((percent ?? 0) * 100).toFixed(1)}%`;
  };

  const formatTooltipValue = (value: ValueType | undefined): string => {
    return formatCurrency(typeof value === "number" ? value : 0);
  };

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
        <MonthYearSelect
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          icone={<Wallet size={20} className="text-primary-500" />}
          title="Saldo"
          hover
          glowEffect={summary.balance > 0}
        >
          <p
            className={`text-2xl font-semibold mt-2
          ${summary.balance >= 0 ? "text-primary-500" : "text-red-600"}`}
          >
            {formatCurrency(summary.balance)}
          </p>
        </Card>

        <Card
          icone={<ArrowUp size={20} className="text-primary-500" />}
          title="Receitas"
          hover
          glowEffectYellow
        >
          <p className="text-2xl font-semibold mt-2 text-primary-500">
            {formatCurrency(summary.totalIncomes)}
          </p>
        </Card>

        <Card
          icone={<Wallet size={20} className="text-red-600" />}
          title="Despesas"
          hover
          glowEffectRed
        >
          <p className="text-2xl font-semibold mt-2 text-red-600">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-3">
        <Card
          icone={<TrendingUp size={20} className="text-primary-500" />}
          title="Despesas por Categoria"
          className="min-h-80"
        >
          {summary.expensesByCategory.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={summary.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    nameKey="categoryName"
                    label={renderPieChatLabel}
                  >
                    {summary.expensesByCategory.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.categoryColor} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTooltipValue} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>Nenhum Registro nesse Período</p>
            </div>
          )}
        </Card>
        <Card
          icone={<Calendar size={20} className="text-primary-500" />}
          title="Histórico Mensal"
          className="min-h-80 p-2.5"
        >
          <div className="h-72 mt-4">
            {monthlyItemsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyItemsData} margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="name"
                    stroke="#94A3B8"
                    tick={{ style: { textTransform: "capitalize" } }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    tickFormatter={formatCurrency}
                    tick={{ style: { fontSize: 13 } }}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(typeof value === "number" ? value : 0)}
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      borderColor: "#2a2a2a",
                    }}
                    labelStyle={{ color: "#f8f8f8" }}
                  />
                  <Legend />
                  <Bar dataKey="expenses" name="Despesas" fill="#FF6384" />
                  <Bar dataKey="income" name="Receitas" fill="#37E359" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Nenhuma Despesa Registrada Nesse Período
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
