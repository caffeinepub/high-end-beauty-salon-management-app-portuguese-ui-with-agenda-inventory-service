import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Appointment, Status } from '../backend';
import { startOfDay, endOfDay } from 'date-fns';

export function useAgenda(selectedDate?: Date) {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const allAppointmentsQuery = useQuery<Appointment[]>({
    queryKey: ['appointments', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      const confirmed = await actor.getAppointmentsByStatus(Status.confirmed);
      const inProgress = await actor.getAppointmentsByStatus(Status.inProgress);
      const finished = await actor.getAppointmentsByStatus(Status.finished);
      return [...confirmed, ...inProgress, ...finished];
    },
    enabled: !!actor && !isFetching,
  });

  const appointments = selectedDate
    ? (allAppointmentsQuery.data || []).filter((apt) => {
        const aptDate = new Date(Number(apt.scheduledTime) / 1_000_000);
        return (
          aptDate >= startOfDay(selectedDate) &&
          aptDate <= endOfDay(selectedDate)
        );
      }).sort((a, b) => Number(a.scheduledTime - b.scheduledTime))
    : [];

  return {
    appointments,
    allAppointments: allAppointmentsQuery.data || [],
    isLoading: allAppointmentsQuery.isLoading,
  };
}

export function useAgendaMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: {
      clientId: bigint;
      serviceId: bigint;
      scheduledTime: bigint;
      duration: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createAppointment(
        data.clientId,
        data.serviceId,
        data.scheduledTime,
        data.duration,
        data.notes
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  return {
    createAppointment: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
