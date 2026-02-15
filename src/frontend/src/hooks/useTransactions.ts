import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Transaction } from '../backend';

export function useTransactions() {
  const { actor, isFetching } = useActor();

  const transactionsQuery = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTransactions();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    transactions: transactionsQuery.data || [],
    isLoading: transactionsQuery.isLoading,
  };
}

export function useMonthlyAggregates(year: number) {
  const { actor, isFetching } = useActor();

  const query = useQuery<Array<[string, number, number]>>({
    queryKey: ['monthlyAggregates', year],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMonthlyAggregates(BigInt(year));
    },
    enabled: !!actor && !isFetching,
  });

  return {
    aggregates: query.data || [],
    isLoading: query.isLoading,
  };
}

export function useTransactionsMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (data: {
      amount: number;
      category: string;
      isExpense: boolean;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addTransaction(
        data.amount,
        data.category,
        data.isExpense,
        data.description
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyAggregates'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: bigint;
      amount: number;
      category: string;
      isExpense: boolean;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateTransaction(
        data.id,
        data.amount,
        data.category,
        data.isExpense,
        data.description
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyAggregates'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteTransaction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyAggregates'] });
    },
  });

  return {
    addTransaction: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateTransaction: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTransaction: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
