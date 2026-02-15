import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Client } from '../backend';

export function useClientes() {
  const { actor, isFetching } = useActor();

  const clientsQuery = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClients();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    clients: clientsQuery.data || [],
    isLoading: clientsQuery.isLoading,
  };
}

export function useClientesMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      contactInfo: string;
      preferences: string;
      allergies: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addClient(
        data.name,
        data.contactInfo,
        data.preferences,
        data.allergies
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    addClient: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
  };
}
