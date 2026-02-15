import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type Client } from '../../backend';
import { useAgenda } from '../../hooks/useAgenda';
import { useServicos } from '../../hooks/useServicos';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Award } from 'lucide-react';

interface ClientDetailPanelProps {
  client: Client;
}

export function ClientDetailPanel({ client }: ClientDetailPanelProps) {
  const { allAppointments } = useAgenda();
  const { services } = useServicos();

  const clientAppointments = allAppointments.filter(
    (apt) => apt.clientId === client.id
  ).sort((a, b) => Number(b.scheduledTime - a.scheduledTime));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{client.name}</CardTitle>
            <CardDescription className="mt-1">{client.contactInfo}</CardDescription>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Award className="h-3 w-3" />
            {client.loyaltyPoints.toString()} pontos
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div>
              <h4 className="font-semibold mb-2">Preferências</h4>
              {client.preferences ? (
                <p className="text-sm text-muted-foreground">{client.preferences}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Nenhuma preferência cadastrada</p>
              )}
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Alergias / Sensibilidades</h4>
              {client.allergies ? (
                <p className="text-sm text-muted-foreground">{client.allergies}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Nenhuma alergia cadastrada</p>
              )}
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Observações</h4>
              <p className="text-sm text-muted-foreground italic">
                Cliente desde {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-3">
              {clientAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum agendamento registrado
                  </p>
                </div>
              ) : (
                clientAppointments.map((appointment) => {
                  const service = services.find(s => s.id === appointment.serviceId);
                  const appointmentDate = new Date(Number(appointment.scheduledTime) / 1_000_000);
                  
                  return (
                    <Card key={appointment.id.toString()}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{service?.name || 'Serviço'}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(appointmentDate, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {appointment.status === 'confirmed' && 'Confirmado'}
                            {appointment.status === 'inProgress' && 'Em Andamento'}
                            {appointment.status === 'finished' && 'Finalizado'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
