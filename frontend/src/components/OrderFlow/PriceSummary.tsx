import '../../styles/components/_order-flow.scss';

interface Props {
  categoryName: string;
  sizeLabel: string;
  price: string;
  currency: string;
  photoPreview: string | null;
  deliveryAddress: string;
  neededByDate: string;
  onAddressChange: (v: string) => void;
  onDateChange: (v: string) => void;
}

export default function PriceSummary({
  categoryName, sizeLabel, price, currency, photoPreview,
  deliveryAddress, neededByDate, onAddressChange, onDateChange,
}: Props) {
  const symbol = currency === 'INR' ? '\u20B9' : '$';
  const formatted = `${symbol}${parseFloat(price).toLocaleString('en-IN')}`;

  // Minimum date = today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="price-summary">
      <div className="price-summary__amount">{formatted}</div>
      <div className="price-summary__currency">Total Amount ({currency})</div>

      {/* Delivery details */}
      <div className="price-summary__fields">
        <div className="price-summary__field">
          <label htmlFor="delivery-address">Delivery Address *</label>
          <textarea
            id="delivery-address"
            placeholder="Enter your full delivery address (Door No, Street, City, State, Pincode)"
            value={deliveryAddress}
            onChange={(e) => onAddressChange(e.target.value)}
            rows={3}
          />
        </div>
        <div className="price-summary__field">
          <label htmlFor="needed-by-date">When do you need it? *</label>
          <input
            id="needed-by-date"
            type="date"
            value={neededByDate}
            onChange={(e) => onDateChange(e.target.value)}
            min={today}
          />
        </div>
      </div>

      <div className="price-summary__details">
        <table>
          <tbody>
            <tr>
              <td>Art Style</td>
              <td>{categoryName}</td>
            </tr>
            <tr>
              <td>Canvas Size</td>
              <td>{sizeLabel}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td><strong>{formatted}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      {photoPreview && (
        <div className="price-summary__photo">
          <img src={photoPreview} alt="Your reference" />
        </div>
      )}
    </div>
  );
}
