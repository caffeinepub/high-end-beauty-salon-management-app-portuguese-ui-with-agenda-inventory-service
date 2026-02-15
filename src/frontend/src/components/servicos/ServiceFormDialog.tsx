import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useServicosMutations } from '../../hooks/useServicos';
import { toast } from 'sonner';

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceFormDialog({ open, onOpenChange }: ServiceFormDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  const { addService, isAdding } = useServicosMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !duration || !price) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const durationNum = parseInt(duration);
    const priceNum = parseFloat(price);

    if (isNaN(durationNum) || durationNum <= 0) {
      toast.error('Duração inválida');
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Preço inválido');
      return;
    }

    try {
      await addService({
        name,
        description,
        duration: BigInt(durationNum),
        price: priceNum,
      });

      toast.success('Serviço adicionado com sucesso!');
      onOpenChange(false);
      
      // Reset form
      setName('');
      setDescription('');
      setDuration('');
      setPrice('');
    } catch (error) {
      toast.error('Erro ao adicionar serviço');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Serviço</DialogTitle>
            <DialogDescription>
              Adicione um novo serviço ao catálogo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Serviço *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Corte Feminino"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o serviço..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duração (minutos) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="60"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="150.00"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? 'Adicionando...' : 'Adicionar Serviço'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
