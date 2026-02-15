import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClientes } from '../../hooks/useClientes';
import { useServicos } from '../../hooks/useServicos';
import { useAgendaMutations } from '../../hooks/useAgenda';
import { toast } from 'sonner';

interface AppointmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
}

export function AppointmentFormDialog({ open, onOpenChange, selectedDate }: AppointmentFormDialogProps) {
  const [clientId, setClientId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [time, setTime] = useState('09:00');
  const [notes, setNotes] = useState('');

  const { clients } = useClientes();
  const { activeServices } = useServicos();
  const { createAppointment, isCreating } = useAgendaMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || !serviceId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(hours, minutes, 0, 0);

    const selectedService = activeServices.find(s => s.id.toString() === serviceId);
    if (!selectedService) {
      toast.error('Serviço não encontrado');
      return;
    }

    try {
      await createAppointment({
        clientId: BigInt(clientId),
        serviceId: BigInt(serviceId),
        scheduledTime: BigInt(scheduledDateTime.getTime() * 1_000_000), // Convert to nanoseconds
        duration: selectedService.duration,
        notes,
      });

      toast.success('Agendamento criado com sucesso!');
      onOpenChange(false);
      
      // Reset form
      setClientId('');
      setServiceId('');
      setTime('09:00');
      setNotes('');
    } catch (error) {
      toast.error('Erro ao criar agendamento');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>
              Crie um novo agendamento para o dia selecionado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente *</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id.toString()} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Serviço *</Label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {activeServices.map((service) => (
                    <SelectItem key={service.id.toString()} value={service.id.toString()}>
                      {service.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Horário *</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Observações sobre o agendamento..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Criando...' : 'Criar Agendamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
