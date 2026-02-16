import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { useMonthlyAggregates } from '../hooks/useTransactions';
import { IncomeVsExpensesBarChart } from '../components/expenses/IncomeVsExpensesBarChart';
import { TransactionForm } from '../components/expenses/TransactionForm';
import { AdminAccessGate } from '../components/admin/AdminAccessGate';
import { type PageView } from '../App';

interface ExpensesDashboardPageProps {
  onNavigate?: (page: PageView) => void;
}

export function ExpensesDashboardPage({ onNavigate }: ExpensesDashboardPageProps) {
  const currentYear = new Date().getFullYear();
  const { aggregates: monthlyAggregates, isLoading } = useMonthlyAggregates(currentYear);

  return (
    <AdminAccessGate onNavigate={onNavigate}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary/10">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Controle de Gastos</h1>
            <p className="text-muted-foreground mt-1">
              Entradas e saídas financeiras
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Receitas vs Despesas ({currentYear})</CardTitle>
              <CardDescription>Comparativo mensal</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Carregando dados...
                </div>
              ) : (
                <IncomeVsExpensesBarChart data={monthlyAggregates} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nova Transação</CardTitle>
              <CardDescription>Registre receitas ou despesas</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminAccessGate>
  );
}
