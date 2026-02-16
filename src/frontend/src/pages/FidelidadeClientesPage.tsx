import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
      <Card className="border-primary bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Owner Access</h3>
                <p className="text-sm text-muted-foreground">
                  Exclusive access to inventory and financial management
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleOwnerPanelClick}
              className="gap-2 font-bold min-w-[200px]"
            >
              <Crown className="h-5 w-5" />
              PAINEL DO DONO
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              {filteredClients.length} {filteredClients.length === 1 ? 'cliente' : 'clientes'}
            </CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando clientes...
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-8">
                <UsersIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Cliente
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredClients.map((client) => (
                  <button
                    key={client.id.toString()}
                    onClick={() => setSelectedClient(client)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedClient?.id === client.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted border-transparent'
                    }`}
                  >
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {client.contactInfo}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {client.loyaltyPoints.toString()} pontos
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Detail */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <ClientDetailPanel client={selectedClient} />
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <UsersIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Selecione um cliente</h3>
                  <p className="text-muted-foreground">
                    Escolha um cliente da lista para ver detalhes
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ClientFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
