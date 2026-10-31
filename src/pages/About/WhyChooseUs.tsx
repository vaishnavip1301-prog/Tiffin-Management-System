
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./WhyChooseUs.css";

function WhyChooseUs() {
  const { t } = useTranslation();

  return (
    <main className="why-choose-page">
      <section className="why-choose-hero">
        <div className="container">
          <span className="why-choose-label">
            {t("whyChooseUs.hero.label")}
          </span>

          <h1>
            {t("whyChooseUs.hero.title")}
            <br />
            <span>{t("whyChooseUs.hero.titleHighlight")}</span>
          </h1>

          <p>{t("whyChooseUs.hero.description")}</p>

          <Link to="/menu" className="why-choose-btn">
            {t("whyChooseUs.hero.button")}
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>

      <section className="why-choose-content">
        <div className="container">
          <div className="why-choose-heading">
            <span className="why-choose-label">
              {t("whyChooseUs.content.label")}
            </span>

            <h2>
              {t("whyChooseUs.content.title")}
              <span>{t("whyChooseUs.content.titleHighlight")}</span>
            </h2>

            <p>{t("whyChooseUs.content.description")}</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <article className="why-choose-card">
                <div className="why-choose-icon">
                  <i className="bi bi-house-heart"></i>
                </div>
                <h3>{t("whyChooseUs.features.homemade.title")}</h3>
                <p>{t("whyChooseUs.features.homemade.description")}</p>
              </article>
            </div>

            <div className="col-md-6 col-lg-4">
              <article className="why-choose-card">
                <div className="why-choose-icon">
                  <i className="bi bi-clock"></i>
                </div>
                <h3>{t("whyChooseUs.features.convenience.title")}</h3>
                <p>{t("whyChooseUs.features.convenience.description")}</p>
              </article>
            </div>

            <div className="col-md-6 col-lg-4">
              <article className="why-choose-card">
                <div className="why-choose-icon">
                  <i className="bi bi-egg-fried"></i>
                </div>
                <h3>{t("whyChooseUs.features.everyday.title")}</h3>
                <p>{t("whyChooseUs.features.everyday.description")}</p>
              </article>
            </div>

            <div className="col-md-6 col-lg-4">
              <article className="why-choose-card">
                <div className="why-choose-icon">
                  <i className="bi bi-heart"></i>
                </div>
                <h3>{t("whyChooseUs.features.care.title")}</h3>
                <p>{t("whyChooseUs.features.care.description")}</p>
              </article>
            </div>

            <div className="col-md-6 col-lg-4">
              <article className="why-choose-card">
                <div className="why-choose-icon">
                  <i className="bi bi-list-check"></i>
                </div>
                <h3>{t("whyChooseUs.features.choices.title")}</h3>
                <p>{t("whyChooseUs.features.choices.description")}</p>
              </article>
            </div>

            <div className="col-md-6 col-lg-4">
              <article className="why-choose-card">
                <div className="why-choose-icon">
                  <i className="bi bi-people"></i>
                </div>
                <h3>{t("whyChooseUs.features.lifestyle.title")}</h3>
                <p>{t("whyChooseUs.features.lifestyle.description")}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="why-choose-cta">
        <div className="container why-choose-cta-inner">
          <div>
            <span className="why-choose-label">
              {t("whyChooseUs.cta.label")}
            </span>

            <h2>{t("whyChooseUs.cta.title")}</h2>

            <p>{t("whyChooseUs.cta.description")}</p>
          </div>

          <Link to="/menu" className="why-choose-btn">
            {t("whyChooseUs.cta.button")}
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default WhyChooseUs;
