import { Link } from 'react-router-dom';
import '../../styles/components/_footer.scss';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__decoration footer__decoration--1" />
      <div className="footer__decoration footer__decoration--2" />

      <div className="footer__content">
        <div className="footer__brand">
          <h3>Madhan <span>Arts</span></h3>
          <p>
            Transforming your cherished memories into timeless hand-drawn masterpieces.
            Every stroke tells your story.
          </p>
          <div className="footer__brand-tagline">
            "Where photos become art"
          </div>
        </div>

        <div className="footer__column">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/login">Get Started</Link></li>
          </ul>
        </div>

        <div className="footer__column">
          <h4>Policies</h4>
          <ul>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms &amp; Conditions</Link></li>
            <li><Link to="/shipping-policy">Shipping Policy</Link></li>
            <li><Link to="/refund-policy">Return &amp; Refund</Link></li>
          </ul>
        </div>

        <div className="footer__column">
          <h4>Connect</h4>
          <ul>
            <li><a href="mailto:mail.madhanarts@gmail.com">Email Us</a></li>
            <li><a href="tel:+919740376584">+91 97403 76584</a></li>
            <li><a href="https://www.madhanarts.in" target="_blank" rel="noopener noreferrer">www.madhanarts.in</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Madhan Arts. Crafted with passion.</p>
        <div className="footer__bottom-links">
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/shipping-policy">Shipping</Link>
          <Link to="/refund-policy">Refund</Link>
        </div>
      </div>
    </footer>
  );
}
