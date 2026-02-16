import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Lock } from 'lucide-react';
import { useAdminPasswordGate } from '../../hooks/useAdminPasswordGate';

interface AdminPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AdminPasswordDialog({ open, onOpenChange, onSuccess }: AdminPasswordDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { verifyLogin, isVerifying } = useAdminPasswordGate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting || isVerifying) return;
    
    setError('');

    // Check for empty fields
    if (username.length === 0 || password.length === 0) {
      setError('Por favor, insira usuário e senha');
      return;
    }

    setIsSubmitting(true);

    try {
      // Pass username and password unchanged to verifyLogin
      const isValid = await verifyLogin(username, password);
      
      if (isValid) {
        // Clear form
        setUsername('');
        setPassword('');
        setError('');
        
        // Close dialog first
        onOpenChange(false);
        
        // Then call success callback
        setTimeout(() => {
          onSuccess();
          setIsSubmitting(false);
        }, 100);
      } else {
        setError('Credenciais incorretas. Tente novamente.');
        setPassword('');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      if (err.message === 'Actor not available') {
        setError('Backend não disponível. Tente novamente mais tarde.');
      } else {
        setError('Erro ao verificar credenciais. Tente novamente.');
      }
      console.error('Login verification error:', err);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setError('');
    onOpenChange(false);
  };

  const isDisabled = isVerifying || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>Acesso Administrativo</DialogTitle>
          </div>
          <DialogDescription>
            Digite suas credenciais de administrador para continuar
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-username">Usuário</Label>
              <Input
                id="admin-username"
                type="text"
                placeholder="Digite o usuário"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                disabled={isDisabled}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Senha</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Digite a senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                disabled={isDisabled}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isDisabled}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isDisabled}>
              {isDisabled ? 'Verificando...' : 'Acessar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
