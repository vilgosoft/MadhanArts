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
  const artworkAmount = Number.parseFloat(price) || 0;
  const shippingCharge = 70;
  const totalAmount = artworkAmount + shippingCharge;
  const formattedArtwork = `${symbol}${artworkAmount.toLocaleString('en-IN')}`;
  const formattedShipping = `${symbol}${shippingCharge.toLocaleString('en-IN')}`;
  const formattedTotal = `${symbol}${totalAmount.toLocaleString('en-IN')}`;

  // Minimum needed-by date = today + 7 days (artwork needs crafting time).
  const minNeededBy = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  })();

  return (
    <div className="price-summary">
      <div className="price-summary__amount">{formattedTotal}</div>
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
            min={minNeededBy}
          />
          <p className="price-summary__date-note">
            Orders placed today can be delivered after 7 days. Each artwork is handcrafted and takes time.
          </p>
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
              <td>{formattedArtwork}</td>
            </tr>
            <tr>
              <td>Shipping Charge</td>
              <td>{formattedShipping}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td><strong>{formattedTotal}</strong></td>
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
