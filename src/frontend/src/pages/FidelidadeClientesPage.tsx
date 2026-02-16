import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Plus, Search, Users as UsersIcon, Crown } from 'lucide-react';
import { useClientes, type Client } from '../hooks/useClientes';
import { ClientFormDialog } from '../components/clientes/ClientFormDialog';
import { ClientDetailPanel } from '../components/clientes/ClientDetailPanel';
import { useAdminPasswordGate } from '../hooks/useAdminPasswordGate';
import { type PageView } from '../App';

interface FidelidadeClientesPageProps {
  onNavigate: (page: PageView) => void;
}

export function FidelidadeClientesPage({ onNavigate }: FidelidadeClientesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { clients, isLoading } = useClientes();
  const { isValidated } = useAdminPasswordGate();

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactInfo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOwnerPanelClick = () => {
    if (isValidated) {
      // Already validated, go directly to inventory
      onNavigate('inventory');
    } else {
      // Not validated, go to login page
      onNavigate('admin-login');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie clientes e configurações
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Adicionar Cliente</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {/* Owner Panel Button - Always visible at top */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">PAINEL DO DONO</CardTitle>
                <CardDescription>
                  Acesso administrativo completo
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={handleOwnerPanelClick}
              size="lg"
              className="gap-2"
            >
              Acessar
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Clients Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UsersIcon className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Clientes</CardTitle>
                <CardDescription>
                  {clients.length} {clients.length === 1 ? 'cliente cadastrado' : 'clientes cadastrados'}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou contato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando clientes...
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado ainda'}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className="w-full text-left p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">{client.contactInfo}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">
                        {client.loyaltyPoints} pontos
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {client.visitHistory.length} {client.visitHistory.length === 1 ? 'visita' : 'visitas'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ClientFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <Sheet open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalhes do Cliente</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedClient && <ClientDetailPanel client={selectedClient} />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
