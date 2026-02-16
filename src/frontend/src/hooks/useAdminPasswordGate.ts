import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';

const SESSION_KEY = 'admin_password_validated';

export function useAdminPasswordGate() {
  const { actor } = useActor();
  const [isValidated, setIsValidated] = useState(false);

  // Check session storage on mount
  useEffect(() => {
    const validated = sessionStorage.getItem(SESSION_KEY) === 'true';
    setIsValidated(validated);
  }, []);

  const verifyLoginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Only trim leading/trailing whitespace, preserve internal spaces
      const normalizedUsername = username.trim();
      const normalizedPassword = password.trim();
      return actor.verifyAdminLogin(normalizedUsername, normalizedPassword);
    },
    onSuccess: (isValid) => {
      if (isValid) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setIsValidated(true);
      }
    },
  });

  const clearValidation = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsValidated(false);
  };

  return {
    isValidated,
    verifyLogin: async (username: string, password: string) => {
      return verifyLoginMutation.mutateAsync({ username, password });
    },
    isVerifying: verifyLoginMutation.isPending,
    clearValidation,
  };
}
