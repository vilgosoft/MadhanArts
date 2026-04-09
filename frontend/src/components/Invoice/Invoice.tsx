import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { Order } from '../../types';
import '../../styles/components/_invoice.scss';

interface InvoiceProps {
  order: Order;
  onClose: () => void;
}

export default function Invoice({ order, onClose }: InvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const symbol = order.currency === 'INR' ? '\u20B9' : '$';
  const amount = `${symbol}${parseFloat(order.amount).toLocaleString('en-IN')}`;
  const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const neededBy = order.needed_by_date
    ? new Date(order.needed_by_date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : null;

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${order.order_number}-invoice.pdf`);
  };

  return (
    <div className="invoice-overlay" onClick={onClose}>
      <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
        <div className="invoice-modal__actions">
          <button className="invoice-modal__download" onClick={handleDownloadPDF}>
            &#128196; Download PDF
          </button>
          <button className="invoice-modal__close" onClick={onClose}>
            &#10005;
          </button>
        </div>

        <div className="invoice" ref={invoiceRef}>
          {/* Header */}
          <div className="invoice__header">
            <div className="invoice__brand">
              <div className="invoice__brand-name">Madhan Arts</div>
              <div className="invoice__brand-tagline">Handcrafted Portrait Studio</div>
            </div>
            <div className="invoice__title">INVOICE</div>
          </div>

          <div className="invoice__divider" />

          {/* Order info row */}
          <div className="invoice__info-row">
            <div className="invoice__info-block">
              <div className="invoice__info-label">Order Number</div>
              <div className="invoice__info-value">{order.order_number}</div>
            </div>
            <div className="invoice__info-block">
              <div className="invoice__info-label">Order Date</div>
              <div className="invoice__info-value">{orderDate}</div>
            </div>
            <div className="invoice__info-block">
              <div className="invoice__info-label">Status</div>
              <div className="invoice__info-value invoice__info-value--status">
                {order.order_status.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Customer & Delivery */}
          <div className="invoice__two-col">
            <div className="invoice__col">
              <div className="invoice__col-title">Customer Details</div>
              <div className="invoice__col-text">
                <strong>{order.user_name || 'Customer'}</strong>
                {order.user_email && <div>{order.user_email}</div>}
                {order.user_phone && <div>{order.user_phone}</div>}
              </div>
            </div>
            <div className="invoice__col">
              <div className="invoice__col-title">Delivery Address</div>
              <div className="invoice__col-text">{order.delivery_address || 'N/A'}</div>
              {neededBy && (
                <>
                  <div className="invoice__col-title" style={{ marginTop: 12 }}>Needed By</div>
                  <div className="invoice__col-text invoice__col-text--highlight">{neededBy}</div>
                </>
              )}
            </div>
          </div>

          {/* Items table */}
          <table className="invoice__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Size</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>{order.category_name} — Custom Portrait</td>
                <td>{order.size_label}</td>
                <td style={{ textAlign: 'right' }}>{amount}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700 }}>Total</td>
                <td style={{ textAlign: 'right' }}>{amount}</td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="invoice__footer">
            <div className="invoice__footer-contact">
              <strong>Madhan Arts</strong>
              <div>8/2, Syed Ali Street, Arisipalayam, Salem – 636009</div>
              <div>mail.madhanarts@gmail.com &nbsp;|&nbsp; +91 97403 76584</div>
            </div>
            <div className="invoice__footer-thanks">Thank you for your order!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
