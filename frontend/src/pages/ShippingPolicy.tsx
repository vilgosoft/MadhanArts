import '../styles/components/_legal.scss';

export default function ShippingPolicy() {
  return (
    <div className="legal-page">
      <header className="legal-page__hero">
        <div className="legal-page__hero-inner">
          <p className="legal-page__eyebrow">Policy</p>
          <h1 className="legal-page__title">Shipping Policy</h1>
          <p className="legal-page__lead">Information about our delivery timelines and process.</p>
        </div>
      </header>

      <div className="legal-page__content">
        <div className="legal-page__container">
          <p className="legal-page__intro">
            This website is operated by <strong>MANIKANDAN V</strong>.
          </p>

          <section className="legal-page__section">
            <h2>Delivery Timeline</h2>
            <p>
              Once an order is placed, it will take <strong>7 business days</strong> to create
              and deliver your handcrafted artwork to the given address. Business days exclude
              Sundays and public holidays.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>Shipping Process</h2>
            <ul className="legal-page__list">
              <li>After your order is confirmed, our artist will begin working on your custom artwork.</li>
              <li>Once completed, the artwork will be carefully packed to ensure safe delivery.</li>
              <li>You will receive a notification when your order is dispatched.</li>
              <li>Delivery will be made to the address provided at the time of placing the order.</li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>Important Notes</h2>
            <ul className="legal-page__list">
              <li>Please ensure the shipping address provided is accurate and complete.</li>
              <li>Delivery timelines may vary slightly based on your location.</li>
              <li>In case of any delays, we will notify you via email or phone.</li>
            </ul>
          </section>

          <section className="legal-page__contact">
            <h2>Questions?</h2>
            <p>For any shipping-related queries, please contact us:</p>
            <ul>
              <li>Email: <a href="mailto:mail.madhanarts@gmail.com">mail.madhanarts@gmail.com</a></li>
              <li>Phone: <a href="tel:+919740376584">+91 97403 76584</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

