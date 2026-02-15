import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Product } from '../backend';

export function useEstoque() {
  const { actor, isFetching } = useActor();

  const productsQuery = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
  };
}

export function useEstoqueMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      brand: string;
      category: string;
      unit: string;
      quantity: number;
      minThreshold: number;
      supplierNotes: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addProduct(
        data.name,
        data.brand,
        data.category,
        data.unit,
        data.quantity,
        data.minThreshold,
        data.supplierNotes
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async (data: { id: bigint; newQuantity: number }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateProductQuantity(data.id, data.newQuantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    addProduct: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateQuantity: updateQuantityMutation.mutateAsync,
    isUpdating: updateQuantityMutation.isPending,
  };
}
