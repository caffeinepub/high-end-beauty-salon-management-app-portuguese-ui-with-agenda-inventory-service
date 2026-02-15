import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

// This file is intentionally minimal as feature-specific hooks are in separate files
// (useAgenda, useEstoque, useServicos, useClientes)

export function useBackendHealth() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      if (!actor) return false;
      return true;
    },
    enabled: !!actor && !isFetching,
  });
}
