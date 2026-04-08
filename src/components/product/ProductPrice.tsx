import type { ReactNode } from 'react';
import { formatCurrency } from '@/lib/locale';

type ProductPriceProps = {
  price: number;
  salePrice?: number | null;
  language?: string;
  currentClassName?: string;
  previousClassName?: string;
  children?: ReactNode;
};

export default function ProductPrice({
  price,
  salePrice,
  language,
  currentClassName = 'text-sm font-body font-semibold text-foreground',
  previousClassName = 'text-xs font-body text-muted-foreground line-through',
  children,
}: ProductPriceProps) {
  const currentPrice = salePrice ?? price;

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={currentClassName}>{formatCurrency(currentPrice, language)}</span>
      {salePrice ? <span className={previousClassName}>{formatCurrency(price, language)}</span> : null}
      {children}
    </div>
  );
}
