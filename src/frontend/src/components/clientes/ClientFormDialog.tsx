import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useClientesMutations } from '../../hooks/useClientes';
import { toast } from 'sonner';

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientFormDialog({ open, onOpenChange }: ClientFormDialogProps) {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [preferences, setPreferences] = useState('');
  const [allergies, setAllergies] = useState('');

  const { addClient, isAdding } = useClientesMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !contactInfo) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      await addClient({
        name,
        contactInfo,
        preferences,
        allergies,
      });

      toast.success('Cliente adicionado com sucesso!');
      onOpenChange(false);
      
      // Reset form
      setName('');
      setContactInfo('');
      setPreferences('');
      setAllergies('');
    } catch (error) {
      toast.error('Erro ao adicionar cliente');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Cliente</DialogTitle>
            <DialogDescription>
              Cadastre um novo cliente no sistema
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Maria Silva"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contato *</Label>
              <Input
                id="contactInfo"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Telefone ou e-mail"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferences">Preferências</Label>
              <Textarea
                id="preferences"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="Serviços preferidos, cores, estilos..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Alergias / Sensibilidades</Label>
              <Textarea
                id="allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Alergias a produtos, sensibilidades..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? 'Adicionando...' : 'Adicionar Cliente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
