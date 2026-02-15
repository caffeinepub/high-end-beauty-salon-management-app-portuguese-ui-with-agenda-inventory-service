import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type Product } from '../../backend';
import { useEstoqueMutations } from '../../hooks/useEstoque';
import { toast } from 'sonner';
import { Plus, Minus } from 'lucide-react';

interface StockAdjustDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export function StockAdjustDialog({ open, onOpenChange, product }: StockAdjustDialogProps) {
  const [adjustmentType, setAdjustmentType] = useState<'increase' | 'decrease'>('increase');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const { updateQuantity, isUpdating } = useEstoqueMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !reason) {
      toast.error('Preencha todos os campos');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Quantidade inválida');
      return;
    }

    const newQuantity = adjustmentType === 'increase' 
      ? product.quantity + amountNum 
      : product.quantity - amountNum;

    if (newQuantity < 0) {
      toast.error('A quantidade não pode ser negativa');
      return;
    }

    try {
      await updateQuantity({ id: product.id, newQuantity });
      
      toast.success(`Estoque ${adjustmentType === 'increase' ? 'aumentado' : 'diminuído'} com sucesso!`);
      onOpenChange(false);
      
      // Reset form
      setAmount('');
      setReason('');
      setAdjustmentType('increase');
    } catch (error) {
      toast.error('Erro ao ajustar estoque');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ajustar Estoque</DialogTitle>
            <DialogDescription>
              {product.name} - Quantidade atual: {product.quantity} {product.unit}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Ajuste</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={adjustmentType === 'increase' ? 'default' : 'outline'}
                  onClick={() => setAdjustmentType('increase')}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Aumentar
                </Button>
                <Button
                  type="button"
                  variant={adjustmentType === 'decrease' ? 'default' : 'outline'}
                  onClick={() => setAdjustmentType('decrease')}
                  className="gap-2"
                >
                  <Minus className="h-4 w-4" />
                  Diminuir
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Quantidade *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo *</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Compra, Uso em serviço, Perda..."
                rows={3}
                required
              />
            </div>

            {amount && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold">Nova quantidade:</span>{' '}
                  {adjustmentType === 'increase' 
                    ? product.quantity + parseFloat(amount || '0')
                    : product.quantity - parseFloat(amount || '0')
                  } {product.unit}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Ajustando...' : 'Confirmar Ajuste'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
