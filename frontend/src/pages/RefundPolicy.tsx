import '../styles/components/_legal.scss';

export default function RefundPolicy() {
  return (
    <div className="legal-page">
      <header className="legal-page__hero">
        <div className="legal-page__hero-inner">
          <p className="legal-page__eyebrow">Policy</p>
          <h1 className="legal-page__title">Return &amp; Refund Policy</h1>
          <p className="legal-page__lead">Our policies on returns, refunds, and product replacements.</p>
        </div>
      </header>

      <div className="legal-page__content">
        <div className="legal-page__container">
          <p className="legal-page__intro">
            This website is operated by <strong>MANIKANDAN V</strong>.
          </p>

          <section className="legal-page__section">
            <h2>Return Policy</h2>
            <p>
              If you receive a damaged product, you can return it within <strong>2 days</strong> after
              delivery. Please contact us immediately with photos of the damaged item to initiate
              the return process.
            </p>
            <ul className="legal-page__list">
              <li>Returns are accepted only for damaged or defective products.</li>
              <li>The return request must be raised within 2 days of delivery.</li>
              <li>Please share clear photographs of the damage when contacting us.</li>
              <li>The product must be in its original packaging for a return to be accepted.</li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>Refund Policy for Services</h2>
            <p>
              As our artworks are custom-made and handcrafted specifically for each order, we
              do <strong>not provide refunds</strong> for our services. Each piece is a unique
              creation tailored to your specifications.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>Refund for Damaged Products</h2>
            <p>
              Once a return is approved for a damaged product, the refund will be processed within
              <strong> 7 business days</strong> and credited to your original payment method (bank account).
            </p>
            <ul className="legal-page__list">
              <li>Refund processing begins after the returned product is received and inspected.</li>
              <li>The refund amount will be credited to your bank account within 7 business days.</li>
              <li>You will receive a confirmation email once the refund has been processed.</li>
            </ul>
          </section>

          <section className="legal-page__contact">
            <h2>Need Help?</h2>
            <p>For any return or refund related queries, please reach out to us:</p>
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

