import { useEffect, useState } from 'react';
import type { PricingRule } from '../../types';
import { pricingApi } from '../../services/api';
import Loader from '../common/Loader';
import '../../styles/components/_order-flow.scss';

interface Props {
  categoryId: number;
  selectedSizeId: number | null;
  onSelect: (sizeId: number, price: string, currency: string) => void;
}

export default function SizeSelector({ categoryId, selectedSizeId, onSelect }: Props) {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pricingApi.byCategory(categoryId).then((res) => {
      setRules(res.data.data);
      setLoading(false);
    });
  }, [categoryId]);

  if (loading) return <Loader text="Loading sizes..." />;

  if (rules.length === 0) {
    return <p style={{ color: '#999', textAlign: 'center' }}>No sizes available for this category.</p>;
  }

  return (
    <div className="size-selector">
      {rules.map((rule) => (
        <div
          key={rule.size_id}
          className={`size-selector__option ${selectedSizeId === rule.size_id ? 'size-selector__option--selected' : ''}`}
          onClick={() => onSelect(rule.size_id, rule.price, rule.currency)}
        >
          <h4>{rule.size_label}</h4>
          {rule.size_description && <span>{rule.size_description}</span>}
          <span className="price">
            {rule.currency === 'INR' ? '₹' : '$'}{parseFloat(rule.price).toLocaleString('en-IN')}
          </span>
        </div>
      ))}
    </div>
  );
}
