import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, DollarSign, Shield } from 'lucide-react';
import { type PageView } from '../App';
import { AdminAccessGate } from '../components/admin/AdminAccessGate';

interface AdminLandingPageProps {
  onNavigate: (page: PageView) => void;
}

export function AdminLandingPage({ onNavigate }: AdminLandingPageProps) {
  return (
    <AdminAccessGate onNavigate={onNavigate}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Área Administrativa</h1>
            <p className="text-muted-foreground mt-1">
              Acesso exclusivo para administradores
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/30 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => onNavigate('inventory')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Controle de Estoque</CardTitle>
                  <CardDescription>Gerencie produtos profissionais</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione, edite e monitore o estoque de produtos. Receba alertas de estoque baixo e mantenha o controle completo do inventário.
              </p>
              <Button className="w-full" onClick={() => onNavigate('inventory')}>
                Acessar Estoque
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/30 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => onNavigate('expenses')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Controle de Gastos</CardTitle>
                  <CardDescription>Entradas e saídas financeiras</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Registre transações, visualize relatórios mensais e acompanhe o fluxo de caixa do salão com gráficos detalhados.
              </p>
              <Button className="w-full" onClick={() => onNavigate('expenses')}>
                Acessar Gastos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminAccessGate>
  );
}
