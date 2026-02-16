import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

const SESSION_KEY = 'admin_auth_state';

interface AdminAuthState {
  isAuthenticated: boolean;
  role: 'admin' | null;
}

export function useAdminPasswordGate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAuthenticated: false,
    role: null,
  });

  // Load persisted auth state on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AdminAuthState;
        setAuthState(parsed);
      } catch {
        // Invalid stored state, clear it
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const verifyLoginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Strict check: username must be exactly 'joana' and password must be exactly 'joana123'
      // NO trimming or normalization - pass credentials directly to backend
      if (username === 'joana' && password === 'joana123') {
        return actor.verifyAdminLogin(username, password);
      }
      
      // Return false for any other combination
      return false;
    },
    onSuccess: async (isValid) => {
      if (isValid) {
        // Force global auth state to authenticated admin
        const newAuthState: AdminAuthState = {
          isAuthenticated: true,
          role: 'admin',
        };
        
        // Persist to sessionStorage
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(newAuthState));
        setAuthState(newAuthState);
        
        // Invalidate admin permission state to trigger refetch
        await queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      }
    },
  });

  const clearValidation = () => {
    // Reset auth state
    const clearedState: AdminAuthState = {
      isAuthenticated: false,
      role: null,
    };
    
    sessionStorage.removeItem(SESSION_KEY);
    setAuthState(clearedState);
    
    // Clear admin state when clearing validation
    queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
  };

  return {
    // Legacy compatibility
    isValidated: authState.isAuthenticated,
    // New global auth state
    isAuthenticated: authState.isAuthenticated,
    role: authState.role,
    verifyLogin: async (username: string, password: string) => {
      return verifyLoginMutation.mutateAsync({ username, password });
    },
    isVerifying: verifyLoginMutation.isPending,
    verifyError: verifyLoginMutation.error,
    clearValidation,
  };
}
