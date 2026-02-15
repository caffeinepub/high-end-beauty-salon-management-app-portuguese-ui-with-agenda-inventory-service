import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Service } from '../backend';

export function useServicos() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const servicesQuery = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServices();
    },
    enabled: !!actor && !isFetching,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (data: { id: bigint; active: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.setServiceStatus(data.id, data.active);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const activeServices = (servicesQuery.data || []).filter(s => s.active);

  return {
    services: servicesQuery.data || [],
    activeServices,
    isLoading: servicesQuery.isLoading,
    toggleServiceStatus: (id: bigint, active: boolean) => 
      toggleStatusMutation.mutateAsync({ id, active }),
  };
}

export function useServicosMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      duration: bigint;
      price: number;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addService(data.name, data.description, data.duration, data.price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  return {
    addService: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
  };
}
