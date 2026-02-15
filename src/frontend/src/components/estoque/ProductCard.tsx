import { Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Product } from '../../backend';

interface ProductCardProps {
  product: Product;
  onQuickAdjust: (product: Product) => void;
}

export function ProductCard({ product, onQuickAdjust }: ProductCardProps) {
  const isLowStock = product.quantity <= product.minThreshold;

  return (
    <div className="bg-card border rounded-2xl p-4 hover:border-primary/30 transition-colors">
      {/* Product Image */}
      <div className="w-full h-32 rounded-xl overflow-hidden bg-muted mb-4 flex items-center justify-center">
        <img
          src="/assets/generated/product-placeholder.dim_800x600.png"
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <Package className="w-12 h-12 text-muted-foreground hidden" />
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">
              {product.quantity}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {product.unit}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              Mínimo: {product.minThreshold} {product.unit}
            </p>
          </div>

          {isLowStock && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Baixo
            </Badge>
          )}
        </div>

        <Button
          onClick={() => onQuickAdjust(product)}
          variant="outline"
          className="w-full"
          size="sm"
        >
          Ajuste Rápido
        </Button>
      </div>
    </div>
  );
}
