
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Footer.css";

function Footer() {
  const { t, i18n } = useTranslation();

  const currentYear = new Date().getFullYear();

  const isMarathi = (
    i18n.resolvedLanguage || i18n.language
  )
    .toLowerCase()
    .startsWith("mr");

  const brandName = isMarathi ? "आपला डब्बा" : "Aapla Dabba";

  return (
    <footer className="aapla-footer">
      <div className="container-fluid px-4 px-lg-5">
        <div className="row gy-5 footer-main">

          {/* Brand Section */}
          <div className="col-lg-4 col-md-6 footer-brand-section">
            <Link to="/" className="footer-brand">
              <img
                src="/images/logo.jpg"
                alt={`${brandName} Logo`}
                className="footer-logo"
              />

              <span className="footer-brand-text">
                {isMarathi ? (
                  <>
                    आपला <strong>डब्बा</strong>
                    <small>घरगुती जेवण, रोज नवीन</small>
                  </>
                ) : (
                  <>
                    Aapla <strong>Dabba</strong>
                    <small>GHARGHUTI JEVAAN, ROJ NAVIN</small>
                  </>
                )}
              </span>
            </Link>

            <p className="footer-description">
              {t("footer.description")}
            </p>

            <div className="footer-socials">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <i className="bi bi-instagram"></i>
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <i className="bi bi-facebook"></i>
              </a>

              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="col-lg-2 col-md-6 col-6 footer-links-section">
            <h5 className="footer-heading">
              {t("footer.company.title")}
            </h5>

            <ul className="footer-links">
              <li>
                <Link to="/">{t("footer.company.home")}</Link>
              </li>

              <li>
                <Link to="/about">{t("footer.company.about")}</Link>
              </li>

              <li>
                <Link to="/menu">{t("footer.company.menu")}</Link>
              </li>

              <li>
                <Link to="/mealplans/dailyplan">
                  {t("footer.company.plans")}
                </Link>
              </li>

              <li>
                <Link to="/contact">
                  {t("footer.company.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className="col-lg-2 col-md-6 col-6 footer-links-section">
            <h5 className="footer-heading">
              {t("footer.usefulLinks.title")}
            </h5>

            <ul className="footer-links">
              <li>
                <Link to="/menu/daily-meal">
                  {t("footer.usefulLinks.dailyTiffin")}
                </Link>
              </li>

              <li>
                <Link to="/mealplans/weeklyplan">
                  {t("footer.usefulLinks.weeklyPlans")}
                </Link>
              </li>

              <li>
                <Link to="/mealplans/monthlyplan">
                  {t("footer.usefulLinks.monthlyPlans")}
                </Link>
              </li>

              <li>
                <Link to="/contact#tiffin-enquiry">
                  {t("footer.usefulLinks.faqs")}
                </Link>
              </li>

              <li>
                <Link to="/contact">
                  {t("footer.usefulLinks.support")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-lg-4 col-md-6 footer-contact-section">
            <h5 className="footer-heading">
              {t("footer.contact.title")}
            </h5>

            <p className="footer-contact-intro">
              {t("footer.contact.description")}
            </p>

            <Link to="/contact" className="footer-contact-item">
              <span className="footer-contact-icon">
                <i className="bi bi-chat-dots"></i>
              </span>

              <span>
                <strong>{t("footer.contact.getInTouch")}</strong>
                <small>{t("footer.contact.enquiry")}</small>
              </span>

              <i className="bi bi-arrow-up-right footer-contact-arrow"></i>
            </Link>

            <Link
              to="/mealplans/dailyplan"
              className="footer-order-btn"
            >
              {t("footer.contact.explorePlans")}
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>
            © {currentYear} <strong>{brandName}</strong>.{" "}
            {t("footer.bottom.rights")}
          </p>

          <div className="footer-bottom-links">
            <Link to="/privacy-policy">
              {t("footer.bottom.privacy")}
            </Link>

            <span></span>

            <Link to="/terms">
              {t("footer.bottom.terms")}
            </Link>
          </div>

          <button
            type="button"
            className="footer-back-to-top"
            aria-label={t("footer.bottom.backToTop")}
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <i className="bi bi-arrow-up"></i>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
