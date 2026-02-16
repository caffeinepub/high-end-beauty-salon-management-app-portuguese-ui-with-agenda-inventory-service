import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMonthlyAggregates } from '../hooks/useTransactions';
import { IncomeVsExpensesBarChart } from '../components/expenses/IncomeVsExpensesBarChart';
import { TransactionForm } from '../components/expenses/TransactionForm';
import { AdminAccessGate } from '../components/admin/AdminAccessGate';

export function ExpensesDashboardPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear] = useState(currentYear);
  
  const { aggregates, isLoading } = useMonthlyAggregates(selectedYear);

  return (
    <AdminAccessGate>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle de Gastos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie entradas e saídas financeiras
          </p>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Entradas vs. Saídas - {selectedYear}</CardTitle>
            <CardDescription>
              Visão mensal do fluxo de caixa
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Carregando dados...
              </div>
            ) : (
              <IncomeVsExpensesBarChart data={aggregates} />
            )}
          </CardContent>
        </Card>

        {/* Transaction Form */}
        <Card>
          <CardHeader>
            <CardTitle>Nova Transação</CardTitle>
            <CardDescription>
              Registre uma entrada ou saída
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionForm />
          </CardContent>
        </Card>
      </div>
    </AdminAccessGate>
  );
}
