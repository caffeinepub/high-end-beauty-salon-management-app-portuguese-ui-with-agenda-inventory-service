import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useAgenda } from '../hooks/useAgenda';
import { AppointmentFormDialog } from '../components/agenda/AppointmentFormDialog';
import { AppointmentListItem } from '../components/agenda/AppointmentListItem';
import { format, addDays, subDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AgendaDeHojePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { appointments, isLoading } = useAgenda(selectedDate);

  const goToPreviousDay = () => setSelectedDate(subDays(selectedDate, 1));
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToToday = () => setSelectedDate(new Date());

  const isToday = startOfDay(selectedDate).getTime() === startOfDay(new Date()).getTime();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda de Hoje</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os agendamentos do dia
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Agendamento</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={goToPreviousDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(selectedDate, 'EEEE', { locale: ptBR })}
                </div>
              </div>
              {!isToday && (
                <Button variant="outline" size="sm" onClick={goToToday} className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Hoje
                </Button>
              )}
            </div>

            <Button variant="outline" size="icon" onClick={goToNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos</CardTitle>
          <CardDescription>
            {appointments.length} {appointments.length === 1 ? 'agendamento' : 'agendamentos'} para este dia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Carregando agendamentos...
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum agendamento para este dia</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando um novo agendamento
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Agendamento
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <AppointmentListItem key={appointment.id.toString()} appointment={appointment} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AppointmentFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
