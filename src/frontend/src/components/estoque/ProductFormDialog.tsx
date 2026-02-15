import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEstoqueMutations } from '../../hooks/useEstoque';
import { toast } from 'sonner';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductFormDialog({ open, onOpenChange }: ProductFormDialogProps) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [minThreshold, setMinThreshold] = useState('');
  const [supplierNotes, setSupplierNotes] = useState('');

  const { addProduct, isAdding } = useEstoqueMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !brand || !category || !unit || !quantity || !minThreshold) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const quantityNum = parseFloat(quantity);
    const minThresholdNum = parseFloat(minThreshold);

    if (isNaN(quantityNum) || quantityNum < 0) {
      toast.error('Quantidade inválida');
      return;
    }

    if (isNaN(minThresholdNum) || minThresholdNum < 0) {
      toast.error('Mínimo inválido');
      return;
    }

    try {
      await addProduct({
        name,
        brand,
        category,
        unit,
        quantity: quantityNum,
        minThreshold: minThresholdNum,
        supplierNotes,
      });

      toast.success('Produto adicionado com sucesso!');
      onOpenChange(false);
      
      // Reset form
      setName('');
      setBrand('');
      setCategory('');
      setUnit('');
      setQuantity('');
      setMinThreshold('');
      setSupplierNotes('');
    } catch (error) {
      toast.error('Erro ao adicionar produto');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Produto</DialogTitle>
            <DialogDescription>
              Adicione um novo produto ao estoque
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Tintura Loiro"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ex: L'Oréal"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: Coloração"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unidade *</Label>
                <Input
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Ex: ml, un"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minThreshold">Mínimo *</Label>
                <Input
                  id="minThreshold"
                  type="number"
                  step="0.01"
                  min="0"
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierNotes">Observações do Fornecedor</Label>
              <Textarea
                id="supplierNotes"
                value={supplierNotes}
                onChange={(e) => setSupplierNotes(e.target.value)}
                placeholder="Informações adicionais..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? 'Adicionando...' : 'Adicionar Produto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
