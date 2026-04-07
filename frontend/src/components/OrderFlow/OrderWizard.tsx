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
    categoryApi.list().then((res) => {
      const cat = res.data.data.find((c) => c.id === Number(categoryId));
      if (cat) setCategory(cat);
    });
  }, [categoryId]);

  if (!category) return <Loader text="Loading..." />;

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
          <span className="section-label">Commission Order</span>
          <h2>{category.name}</h2>
          <p>Complete the steps below to place your art commission</p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          {STEPS.map((label, i) => (
            <div key={label} style={{ display: 'contents' }}>
              {i > 0 && (
                <div className={`step-indicator__connector ${i <= step ? 'step-indicator__connector--done' : ''}`} />
              )}
              <div className={`step-indicator__step ${i === step ? 'step-indicator__step--active' : ''} ${i < step ? 'step-indicator__step--done' : ''}`}>
                <div className="step-indicator__step-circle">
                  {i < step ? '\u2713' : i + 1}
                </div>
                <span className="step-indicator__step-label">{label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Wizard Card */}
        <div className="wizard-card" key={step}>
          {step === 0 && (
            <>
              <h2>Upload Reference Photo</h2>
              <p>Upload the photo you'd like us to transform into art</p>
              <PhotoUpload photo={photo} onPhotoSelect={setPhoto} />
            </>
          )}

          {step === 1 && (
            <>
              <h2>Choose Your Size</h2>
              <p>Select the canvas or paper size for your artwork</p>
              <SizeSelector
                categoryId={category.id}
                selectedSizeId={selectedSizeId}
                onSelect={(sizeId, p, c, label) => {
                  setSelectedSizeId(sizeId);
                  setPrice(p);
                  setCurrency(c);
                  setSizeLabel(label);
                }}
              />
            </>
          )}

          {step === 2 && (
            <>
              <h2>Review & Confirm</h2>
              <p>Verify your order details before placing</p>
              <PriceSummary
                categoryName={category.name}
                sizeLabel={sizeLabel}
                price={price}
                currency={currency}
                photoPreview={photo ? URL.createObjectURL(photo) : null}
              />
              {error && <div className="wizard-error">{error}</div>}
            </>
          )}

          {/* Navigation */}
          <div className="wizard-nav">
            {step > 0 ? (
              <button className="wizard-nav__back" onClick={() => setStep(step - 1)}>
                &#8592; Back
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
                Continue &#8594;
              </button>
            ) : (
              <button
                className="wizard-nav__next"
                disabled={submitting || !user}
                onClick={handleSubmit}
              >
                {submitting ? 'Placing Order...' : !user ? 'Login to Order' : 'Place Order &#10003;'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
