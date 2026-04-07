import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { categoryApi, orderApi } from '../../services/api';
import type { Category } from '../../types';
import PhotoUpload from './PhotoUpload';
import SizeSelector from './SizeSelector';
import PriceSummary from './PriceSummary';
import Loader from '../common/Loader';
import '../../styles/components/_order-flow.scss';

const STEPS = ['Upload Photo', 'Select Size', 'Review & Pay'];

export default function OrderWizard() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [category, setCategory] = useState<Category | null>(null);
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [sizeLabel, setSizeLabel] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!categoryId) return;
    // Try loading by ID first — the public API uses slug,
    // but we navigate here with ID from gallery cards
    categoryApi.list().then((res) => {
      const cat = res.data.data.find((c) => c.id === Number(categoryId));
      if (cat) setCategory(cat);
    });
  }, [categoryId]);

  if (!category) return <Loader text="Loading category..." />;

  const handleSizeSelect = (sizeId: number, p: string, c: string) => {
    setSelectedSizeId(sizeId);
    setPrice(p);
    setCurrency(c);
    // Find size label from pricing data
    // We'll get it from the SizeSelector component's rules
  };

  const canNext = () => {
    if (step === 0) return !!photo;
    if (step === 1) return !!selectedSizeId;
    return true;
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/order/${categoryId}` } });
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('reference_photo', photo!);
      formData.append('category_id', String(category.id));
      formData.append('size_id', String(selectedSizeId));

      const res = await orderApi.create(formData);
      navigate('/order-success', { state: { order: res.data.data } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to place order. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="order-page">
      <div className="container">
        <div className="section-title">
          <h2>Order: {category.name}</h2>
          <p>Complete the steps below to place your commission order</p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          {STEPS.map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {i > 0 && (
                <div className={`step-indicator__connector ${i <= step ? 'step-indicator__connector--done' : ''}`} />
              )}
              <div className={`step-indicator__step ${i === step ? 'step-indicator__step--active' : ''} ${i < step ? 'step-indicator__step--done' : ''}`}>
                <div className="step-indicator__step-number">
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="step-indicator__step-label">{label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Wizard Card */}
        <div className="wizard-card">
          {step === 0 && (
            <>
              <h2>Upload Reference Photo</h2>
              <p>Upload the photo you'd like us to create artwork from</p>
              <PhotoUpload photo={photo} onPhotoSelect={setPhoto} />
            </>
          )}

          {step === 1 && (
            <>
              <h2>Select Size</h2>
              <p>Choose the canvas/paper size for your artwork</p>
              <SizeSelector
                categoryId={category.id}
                selectedSizeId={selectedSizeId}
                onSelect={(sizeId, p, c) => {
                  handleSizeSelect(sizeId, p, c);
                  // Update size label from the element
                  const el = document.querySelector(`.size-selector__option--selected h4`);
                  if (el) setSizeLabel(el.textContent || '');
                  setTimeout(() => {
                    const selected = document.querySelector('.size-selector__option--selected h4');
                    if (selected) setSizeLabel(selected.textContent || '');
                  }, 0);
                }}
              />
            </>
          )}

          {step === 2 && (
            <>
              <h2>Review & Pay</h2>
              <p>Confirm your order details and proceed to payment</p>
              <PriceSummary
                categoryName={category.name}
                sizeLabel={sizeLabel}
                price={price}
                currency={currency}
                photoPreview={photo ? URL.createObjectURL(photo) : null}
              />
              {error && (
                <p style={{ color: '#e74c3c', textAlign: 'center', marginTop: '16px' }}>
                  {error}
                </p>
              )}
            </>
          )}

          {/* Navigation */}
          <div className="wizard-nav">
            {step > 0 ? (
              <button className="wizard-nav__back" onClick={() => setStep(step - 1)}>
                Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                className="wizard-nav__next"
                disabled={!canNext()}
                onClick={() => setStep(step + 1)}
              >
                Next
              </button>
            ) : (
              <button
                className="wizard-nav__next"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
