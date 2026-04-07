import '../../styles/components/_order-flow.scss';

interface Props {
  categoryName: string;
  sizeLabel: string;
  price: string;
  currency: string;
  photoPreview: string | null;
}

export default function PriceSummary({ categoryName, sizeLabel, price, currency, photoPreview }: Props) {
  const symbol = currency === 'INR' ? '₹' : '$';
  const formatted = `${symbol}${parseFloat(price).toLocaleString('en-IN')}`;

  return (
    <div className="price-summary">
      <div className="price-summary__amount">{formatted}</div>

      <div className="price-summary__details">
        <table>
          <tbody>
            <tr>
              <td>Category</td>
              <td>{categoryName}</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>{sizeLabel}</td>
            </tr>
            <tr>
              <td>Total</td>
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
