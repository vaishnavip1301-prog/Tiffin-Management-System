
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./OurStory.css";

function OurStory() {
  const { t } = useTranslation();

  return (
    <main className="our-story-page">
      {/* Hero Section */}
      <section className="our-story-hero">
        <div className="our-story-overlay"></div>

        <div className="container our-story-hero-content">
          <span className="our-story-kicker">
            {t("ourStory.hero.label")}
          </span>

          <h1>
            {t("ourStory.hero.title")}
            <br />
            <span>{t("ourStory.hero.titleHighlight")}</span>
          </h1>

          <p>{t("ourStory.hero.description")}</p>

          <div className="our-story-buttons">
            <Link to="/menu" className="our-story-primary-btn">
              {t("ourStory.hero.menuButton")}
            </Link>

            <Link to="/about" className="our-story-secondary-btn">
              {t("ourStory.hero.aboutButton")}
            </Link>
          </div>

          <div className="our-story-highlights">
            <span>
              <i className="bi bi-heart-fill"></i>
              {t("ourStory.hero.highlights.care")}
            </span>

            <span>
              <i className="bi bi-house-heart-fill"></i>
              {t("ourStory.hero.highlights.homemade")}
            </span>

            <span>
              <i className="bi bi-egg-fried"></i>
              {t("ourStory.hero.highlights.fresh")}
            </span>
          </div>
        </div>
      </section>

      {/* Our Beginning */}
      <section className="our-story-beginning">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="our-story-image-wrap">
                <img
                  src="/images/t4.jpg"
                  alt={t("ourStory.beginning.imageAlt")}
                  className="our-story-image"
                />

                <div className="our-story-image-caption">
                  <i className="bi bi-heart-fill"></i>
                  <div>
                    <strong>
                      {t("ourStory.beginning.imageTitle")}
                    </strong>
                    <span>
                      {t("ourStory.beginning.imageSubtitle")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <span className="our-story-section-label">
                {t("ourStory.beginning.label")}
              </span>

              <h2>
                {t("ourStory.beginning.title")}
                <br />
                <span>{t("ourStory.beginning.titleHighlight")}</span>
              </h2>

              <p>{t("ourStory.beginning.paragraph1")}</p>

              <p>{t("ourStory.beginning.paragraph2")}</p>

              <Link to="/menu" className="our-story-text-link">
                {t("ourStory.beginning.link")}
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Purpose */}
      <section className="our-story-purpose">
        <div className="container">
          <div className="our-story-heading">
            <span className="our-story-section-label">
              {t("ourStory.purpose.label")}
            </span>

            <h2>
              {t("ourStory.purpose.title")}
              <span>{t("ourStory.purpose.titleHighlight")}</span>
            </h2>

            <p>{t("ourStory.purpose.description")}</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <article className="our-story-value-card">
                <div className="our-story-value-icon">
                  <i className="bi bi-heart"></i>
                </div>

                <h3>{t("ourStory.purpose.mission.title")}</h3>

                <p>{t("ourStory.purpose.mission.description")}</p>
              </article>
            </div>

            <div className="col-md-4">
              <article className="our-story-value-card">
                <div className="our-story-value-icon">
                  <i className="bi bi-stars"></i>
                </div>

                <h3>{t("ourStory.purpose.promise.title")}</h3>

                <p>{t("ourStory.purpose.promise.description")}</p>
              </article>
            </div>

            <div className="col-md-4">
              <article className="our-story-value-card">
                <div className="our-story-value-icon">
                  <i className="bi bi-house-heart"></i>
                </div>

                <h3>{t("ourStory.purpose.belief.title")}</h3>

                <p>{t("ourStory.purpose.belief.description")}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="our-story-cta">
        <div className="container">
          <div className="our-story-cta-inner">
            <div>
              <span className="our-story-section-label">
                {t("ourStory.cta.label")}
              </span>

              <h2>{t("ourStory.cta.title")}</h2>

              <p>{t("ourStory.cta.description")}</p>
            </div>

            <Link to="/menu" className="our-story-cta-btn">
              {t("ourStory.cta.button")}
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default OurStory;
