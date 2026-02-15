import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMonthlyAggregates } from '../hooks/useTransactions';
import { IncomeVsExpensesBarChart } from '../components/expenses/IncomeVsExpensesBarChart';
import { TransactionForm } from '../components/expenses/TransactionForm';
import { useAdmin } from '../hooks/useAdmin';
import { AlertTriangle } from 'lucide-react';

export function ExpensesDashboardPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear] = useState(currentYear);
  
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { aggregates, isLoading } = useMonthlyAggregates(selectedYear);

  if (isAdminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Verificando permissões...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
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
  );
}
