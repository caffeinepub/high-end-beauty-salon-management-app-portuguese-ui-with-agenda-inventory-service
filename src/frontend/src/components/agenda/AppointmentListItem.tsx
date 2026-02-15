import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Scissors } from 'lucide-react';
import { type Appointment, Status } from '../../backend';
import { useClientes } from '../../hooks/useClientes';
import { useServicos } from '../../hooks/useServicos';
import { format } from 'date-fns';

interface AppointmentListItemProps {
  appointment: Appointment;
}

const statusLabels: Record<Status, string> = {
  [Status.confirmed]: 'Confirmado',
  [Status.inProgress]: 'Em Andamento',
  [Status.finished]: 'Finalizado',
};

const statusVariants: Record<Status, 'default' | 'secondary' | 'outline'> = {
  [Status.confirmed]: 'secondary',
  [Status.inProgress]: 'default',
  [Status.finished]: 'outline',
};

export function AppointmentListItem({ appointment }: AppointmentListItemProps) {
  const { clients } = useClientes();
  const { services } = useServicos();

  const client = clients.find(c => c.id === appointment.clientId);
  const service = services.find(s => s.id === appointment.serviceId);

  const appointmentTime = new Date(Number(appointment.scheduledTime) / 1_000_000);
  const durationMinutes = Number(appointment.duration);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <Badge variant={statusVariants[appointment.status]}>
                {statusLabels[appointment.status]}
              </Badge>
              <span className="text-sm text-muted-foreground">
                #{appointment.id.toString()}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">
                  {format(appointmentTime, 'HH:mm')}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({durationMinutes} min)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{client?.name || 'Cliente não encontrado'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Scissors className="h-4 w-4 text-muted-foreground" />
                <span>{service?.name || 'Serviço não encontrado'}</span>
              </div>

              {appointment.notes && (
                <p className="text-sm text-muted-foreground mt-2">
                  {appointment.notes}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
