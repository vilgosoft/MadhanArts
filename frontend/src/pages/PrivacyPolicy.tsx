import '../styles/components/_legal.scss';

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <header className="legal-page__hero">
        <div className="legal-page__hero-inner">
          <p className="legal-page__eyebrow">Legal</p>
          <h1 className="legal-page__title">Privacy Policy</h1>
          <p className="legal-page__lead">Your privacy is important to us. Please read our policy carefully.</p>
        </div>
      </header>

      <div className="legal-page__content">
        <div className="legal-page__container">
          <p className="legal-page__intro">
            This website is operated by <strong>MANIKANDAN V</strong>.
          </p>

          <section className="legal-page__section">
            <h2>1. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>
              We collect personal details such as your name, email address, shipping address,
              phone number, and payment information when you make a purchase, create an account,
              or contact us.
            </p>
            <h3>Non-Personal Information</h3>
            <p>
              We may collect non-personal data such as browser type, operating system, and browsing
              behavior to improve our website and services.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>2. How We Use Your Information</h2>
            <h3>To Process Orders</h3>
            <p>We use your personal information to process and fulfill your orders.</p>
            <h3>To Communicate</h3>
            <p>
              We use your contact information to send you updates about your order, respond to
              inquiries, and send promotional materials if you have opted in.
            </p>
            <h3>To Improve Our Services</h3>
            <p>
              We analyze non-personal information to understand user behavior and enhance our
              website's performance.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>3. Information Sharing</h2>
            <h3>Third-Party Service Providers</h3>
            <p>
              We may share your information with third-party service providers who assist us in
              operating our website, processing payments, and delivering orders.
            </p>
            <h3>Legal Requirements</h3>
            <p>We may disclose your information if required by law or to protect our rights.</p>
          </section>

          <section className="legal-page__section">
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information
              from unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>5. Your Rights</h2>
            <h3>Access and Correction</h3>
            <p>
              You have the right to access and correct your personal information. You can update
              your account details through our website.
            </p>
            <h3>Opt-Out</h3>
            <p>
              You can opt-out of receiving promotional emails by following the unsubscribe
              instructions in the emails.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>6. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on
              this page, and the revised date will be indicated at the top of the policy.
            </p>
          </section>

          <section className="legal-page__contact">
            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li>Email: <a href="mailto:mail.madhanarts@gmail.com">mail.madhanarts@gmail.com</a></li>
              <li>Phone: <a href="tel:+919740376584">+91 97403 76584</a></li>
              <li>Website: <a href="https://www.madhanarts.in" target="_blank" rel="noopener noreferrer">www.madhanarts.in</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

