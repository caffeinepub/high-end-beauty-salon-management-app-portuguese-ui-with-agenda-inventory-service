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
  const { verifyLogin, isVerifying } = useAdminPasswordGate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Only trim leading/trailing whitespace, preserve internal spaces
    const normalizedUsername = username.trim();
    const normalizedPassword = password.trim();

    if (!normalizedUsername || !normalizedPassword) {
      setError('Por favor, insira usuário e senha');
      return;
    }

    try {
      const isValid = await verifyLogin(normalizedUsername, normalizedPassword);
      if (isValid) {
        setUsername('');
        setPassword('');
        setError('');
        onOpenChange(false);
        onSuccess();
      } else {
        setError('Credenciais incorretas. Tente novamente.');
        setPassword('');
      }
    } catch (err) {
      setError('Erro ao verificar credenciais. Tente novamente.');
      console.error('Login verification error:', err);
    }
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setError('');
    onOpenChange(false);
  };

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
                disabled={isVerifying}
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
                disabled={isVerifying}
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
              disabled={isVerifying}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isVerifying}>
              {isVerifying ? 'Verificando...' : 'Acessar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
