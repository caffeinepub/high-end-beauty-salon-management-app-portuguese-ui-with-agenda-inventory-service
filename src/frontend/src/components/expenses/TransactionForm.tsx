import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTransactionsMutations } from '../../hooks/useTransactions';
import { toast } from 'sonner';

export function TransactionForm() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');

  const { addTransaction, isAdding } = useTransactionsMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Valor inválido');
      return;
    }

    try {
      await addTransaction({
        amount: amountValue,
        category,
        isExpense: type === 'expense',
        description,
      });

      toast.success('Transação registrada com sucesso!');
      
      // Reset form
      setAmount('');
      setCategory('');
      setType('expense');
      setDescription('');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Erro ao registrar transação');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo *</Label>
          <Select value={type} onValueChange={(value) => setType(value as 'income' | 'expense')}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Entrada</SelectItem>
              <SelectItem value="expense">Saída</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Valor (R$) *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria *</Label>
        <Input
          id="category"
          placeholder="Ex: Produtos, Serviços, Aluguel..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Detalhes adicionais..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={isAdding} className="w-full sm:w-auto">
        {isAdding ? 'Registrando...' : 'Registrar Transação'}
      </Button>
    </form>
  );
}
