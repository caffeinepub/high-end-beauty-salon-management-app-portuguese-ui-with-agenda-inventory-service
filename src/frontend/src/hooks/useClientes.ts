import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type ClientID } from '../backend';

// Local Client type inferred from backend structure
export interface Client {
  id: ClientID;
  name: string;
  contactInfo: string;
  preferences: string;
  loyaltyPoints: bigint;
  allergies: string;
  visitHistory: bigint[];
}

export function useClientes() {
  const { actor, isFetching } = useActor();

  // Since getAllClients doesn't exist in backend, return empty array
  // This would need to be implemented in the backend
  const clientsQuery = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      // Backend doesn't have getAllClients method
      return [];
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
