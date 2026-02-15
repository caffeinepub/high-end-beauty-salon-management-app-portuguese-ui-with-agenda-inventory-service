import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Scissors, X } from 'lucide-react';
import { useServicos } from '../hooks/useServicos';
import { ServiceFormDialog } from '../components/servicos/ServiceFormDialog';
import { ServiceCardListItem } from '../components/servicos/ServiceCardListItem';
import { AppointmentFormDialog } from '../components/agenda/AppointmentFormDialog';
import { type Service } from '../backend';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export function CatalogoDeServicosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<Service | null>(null);
  const [nailsFilterActive, setNailsFilterActive] = useState(false);

  const { services, isLoading, toggleServiceStatus } = useServicos();

  const filteredServices = services.filter((service) => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!nailsFilterActive) {
      return matchesSearch;
    }

    // Apply nails designer filter
    const nailsKeywords = ['nail', 'nails', 'unha', 'unhas', 'manicure', 'pedicure', 'designer'];
    const matchesNails = nailsKeywords.some(keyword => 
      service.name.toLowerCase().includes(keyword) ||
      service.description.toLowerCase().includes(keyword)
    );

    return matchesSearch && matchesNails;
  });

  const handleScheduleService = (service: Service) => {
    setPreselectedService(service);
    setIsAppointmentDialogOpen(true);
  };

  const handleClearNailsFilter = () => {
    setNailsFilterActive(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo de Serviços</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie serviços e preços
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Adicionar Serviço</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Serviços</CardTitle>
              <CardDescription>
                {filteredServices.length} {filteredServices.length === 1 ? 'serviço' : 'serviços'}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant={nailsFilterActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNailsFilterActive(!nailsFilterActive)}
                className="gap-2 relative"
              >
                Nails Designer
                {nailsFilterActive && (
                  <X 
                    className="h-3 w-3 ml-1" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearNailsFilter();
                    }}
                  />
                )}
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar serviços..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Carregando serviços...
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <Scissors className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm || nailsFilterActive ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || nailsFilterActive
                  ? 'Tente ajustar o termo de busca ou filtro'
                  : 'Comece adicionando serviços ao catálogo'
                }
              </p>
              {!searchTerm && !nailsFilterActive && (
                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Serviço
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <div key={service.id.toString()} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-2xl bg-card hover:border-primary/30 transition-colors">
                  <ServiceCardListItem
                    service={service}
                    onSchedule={handleScheduleService}
                  />
                  <div className="flex items-center gap-3 ml-auto">
                    <Badge variant={service.active ? 'secondary' : 'outline'}>
                      {service.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <Switch
                      checked={service.active}
                      onCheckedChange={() => toggleServiceStatus(service.id, !service.active)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ServiceFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <AppointmentFormDialog
        open={isAppointmentDialogOpen}
        onOpenChange={setIsAppointmentDialogOpen}
        preselectedService={preselectedService}
      />
    </div>
  );
}
