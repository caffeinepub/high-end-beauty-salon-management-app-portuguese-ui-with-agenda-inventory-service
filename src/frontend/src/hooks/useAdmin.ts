import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useAdmin() {
  const { actor, isFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    retry: false,
    staleTime: 0, // Always refetch when invalidated
  });

  return {
    isAdmin: query.data || false,
    isLoading: query.isLoading || isFetching,
    isFetched: query.isFetched,
    refetch: query.refetch, // Expose refetch for manual admin permission refresh
  };
}
