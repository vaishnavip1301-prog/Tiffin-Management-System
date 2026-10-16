import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="aapla-footer">
      <div className="container-fluid px-4 px-lg-5">
        <div className="row gy-5 footer-main">

          <div className="col-lg-4 col-md-6 footer-brand-section">
            <Link to="/" className="footer-brand">
              <img
                src="/images/logo.jpg"
                alt="Aapla Dabba Logo"
                className="footer-logo"
              />

              <span className="footer-brand-text">
                Aapla <strong>Dabba</strong>
                <small>GHARGHUTI JEVAAN, ROJ NAVIN</small>
              </span>
            </Link>

            <p className="footer-description">
              Bringing the taste of homemade food to your doorstep.
              Enjoy fresh, delicious and wholesome meals prepared with
              care, just like home.
            </p>

            <div className="footer-socials">
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 col-6 footer-links-section">
            <h5 className="footer-heading">Company</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/menu">Our Menu</Link></li>
              <li><Link to="/plans">Meal Plans</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6 footer-links-section">
            <h5 className="footer-heading">Useful Links</h5>
            <ul className="footer-links">
              <li><Link to="/menu">Daily Tiffin</Link></li>
              <li><Link to="/plans">Weekly Plans</Link></li>
              <li><Link to="/plans">Monthly Plans</Link></li>
              <li><Link to="/contact">FAQs</Link></li>
              <li><Link to="/contact">Help & Support</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6 footer-contact-section">
            <h5 className="footer-heading">Contact Us</h5>

            <p className="footer-contact-intro">
              Have a question about our tiffin services? We are happy
              to help you.
            </p>

            <Link to="/contact" className="footer-contact-item">
              <span className="footer-contact-icon">
                <i className="bi bi-chat-dots"></i>
              </span>
              <span>
                <strong>Get in touch</strong>
                <small>Enquire about our meal plans</small>
              </span>
              <i className="bi bi-arrow-up-right footer-contact-arrow"></i>
            </Link>

            <Link to="/plans" className="footer-order-btn">
              Explore Meal Plans
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} <strong>Aapla Dabba</strong>. All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span></span>
            <Link to="/terms">Terms & Conditions</Link>
          </div>

          <button
            type="button"
            className="footer-back-to-top"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <i className="bi bi-arrow-up"></i>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;