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
          <h4>Art Styles</h4>
          <ul>
            <li><a href="#gallery">Pencil Sketch</a></li>
            <li><a href="#gallery">Color Pencil</a></li>
            <li><a href="#gallery">Acrylic Painting</a></li>
            <li><a href="#gallery">Oil Painting</a></li>
          </ul>
        </div>

        <div className="footer__column">
          <h4>Connect</h4>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">YouTube</a></li>
            <li><a href="#">WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Madhan Arts. Crafted with passion.</p>
        <div className="footer__bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}
