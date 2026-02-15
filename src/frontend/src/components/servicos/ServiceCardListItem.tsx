import { Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Service } from '../../backend';

interface ServiceCardListItemProps {
  service: Service;
  onSchedule: (service: Service) => void;
}

export function ServiceCardListItem({ service, onSchedule }: ServiceCardListItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDuration = (minutes: bigint) => {
    const mins = Number(minutes);
    if (mins < 60) return `${mins}min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}min` : `${hours}h`;
  };

  return (
    <div className="flex-1 flex flex-col sm:flex-row items-start gap-4">
      {/* Service Image */}
      <div className="w-full sm:w-24 h-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
        <img
          src="/assets/generated/service-placeholder.dim_800x600.png"
          alt={service.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Service Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {service.description}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(service.duration)}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-primary">
            <DollarSign className="h-4 w-4" />
            <span>{formatPrice(service.price)}</span>
          </div>
        </div>
      </div>

      {/* Schedule Button */}
      <Button
        onClick={() => onSchedule(service)}
        className="w-full sm:w-auto"
        size="default"
      >
        Agendar
      </Button>
    </div>
  );
}
