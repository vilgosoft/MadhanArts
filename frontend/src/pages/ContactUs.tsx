import '../styles/components/_contact.scss';

export default function ContactUs() {
  return (
    <div className="contact-page">
      <header className="contact-page__hero">
        <div className="contact-page__hero-inner">
          <p className="contact-page__eyebrow">Get In Touch</p>
          <h1 className="contact-page__title">Contact Us</h1>
          <p className="contact-page__lead">
            Have questions about a commission or want to discuss your custom artwork? We'd love to hear from you.
          </p>
        </div>
      </header>

      <div className="contact-page__content">
        <div className="contact-page__grid">

          <div className="contact-card">
            <div className="contact-card__icon">&#128222;</div>
            <h3 className="contact-card__title">Phone</h3>
            <p className="contact-card__text">Call or WhatsApp us</p>
            <a href="tel:+919740376584" className="contact-card__link">+91 97403 76584</a>
          </div>

          <div className="contact-card">
            <div className="contact-card__icon">&#9993;</div>
            <h3 className="contact-card__title">Email</h3>
            <p className="contact-card__text">Write to us anytime</p>
            <a href="mailto:mail.madhanarts@gmail.com" className="contact-card__link">mail.madhanarts@gmail.com</a>
          </div>

          <div className="contact-card">
            <div className="contact-card__icon">&#128205;</div>
            <h3 className="contact-card__title">Studio Address</h3>
            <p className="contact-card__text">Visit our studio</p>
            <address className="contact-card__address">
              8/2, Syed Ali Street,<br />
              Arisipalayam,<br />
              Salem &ndash; 636009,<br />
              Tamil Nadu, India
            </address>
          </div>

        </div>

        <div className="contact-page__map">
          <iframe
            title="Madhan Arts Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.6!2d78.145!3d11.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDM5JzAwLjAiTiA3OMKwMDgnNDIuMCJF!5e0!3m2!1sen!2sin!4v1700000000000"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: '12px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
