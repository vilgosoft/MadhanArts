import { useEffect, useState } from 'react';
import type { PricingRule } from '../../types';
import { pricingApi } from '../../services/api';
import Loader from '../common/Loader';
import '../../styles/components/_order-flow.scss';

interface Props {
  categoryId: number;
  selectedSizeId: number | null;
  onSelect: (sizeId: number, price: string, currency: string, sizeLabel: string) => void;
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

  if (loading) return <Loader text="Loading available sizes..." />;

  if (rules.length === 0) {
    return (
      <div className="gallery-empty">
        <div className="gallery-empty__icon">&#128207;</div>
        <p>No sizes available for this category yet.</p>
      </div>
    );
  }

  return (
    <div className="size-selector">
      {rules.map((rule) => (
        <div
          key={rule.size_id}
          className={`size-selector__option ${selectedSizeId === rule.size_id ? 'size-selector__option--selected' : ''}`}
          onClick={() => onSelect(rule.size_id, rule.price, rule.currency, rule.size_label)}
        >
          <h4>{rule.size_label}</h4>
          {rule.size_description && (
            <span className="size-selector__option-desc">{rule.size_description}</span>
          )}
          <span className="size-selector__option-price">
            {rule.currency === 'INR' ? '\u20B9' : '$'}
            {parseFloat(rule.price).toLocaleString('en-IN')}
          </span>
        </div>
      ))}
    </div>
  );
}
