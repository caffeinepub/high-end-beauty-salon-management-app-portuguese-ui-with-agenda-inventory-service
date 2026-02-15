import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IncomeVsExpensesBarChartProps {
  data: Array<[string, number, number]>;
}

export function IncomeVsExpensesBarChart({ data }: IncomeVsExpensesBarChartProps) {
  const chartData = data.map(([month, income, expenses]) => ({
    month,
    Entradas: income,
    Saídas: expenses,
  }));

  if (chartData.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhum dado disponível para o período selecionado
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="month" 
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          formatter={(value: number) => 
            new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(value)
          }
        />
        <Legend />
        <Bar 
          dataKey="Entradas" 
          fill="hsl(var(--primary))" 
          radius={[8, 8, 0, 0]}
        />
        <Bar 
          dataKey="Saídas" 
          fill="hsl(var(--destructive))" 
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
