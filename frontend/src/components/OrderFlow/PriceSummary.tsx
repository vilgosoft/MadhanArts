import '../../styles/components/_order-flow.scss';

interface Props {
  categoryName: string;
  sizeLabel: string;
  price: string;
  currency: string;
  photoPreview: string | null;
}

export default function PriceSummary({ categoryName, sizeLabel, price, currency, photoPreview }: Props) {
  const symbol = currency === 'INR' ? '\u20B9' : '$';
  const formatted = `${symbol}${parseFloat(price).toLocaleString('en-IN')}`;

  return (
    <div className="price-summary">
      <div className="price-summary__amount">{formatted}</div>
      <div className="price-summary__currency">Total Amount ({currency})</div>

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
