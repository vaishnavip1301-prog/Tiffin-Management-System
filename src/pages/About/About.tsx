
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./About.css";

function About() {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const sections: Record<string, string> = {
      "/about/our-story": "our-story",
      "/about/why-choose-us": "why-choose-us",
      "/about/our-kitchen": "our-kitchen",
    };

    const sectionId = sections[location.pathname];

    if (sectionId) {
      const timer = window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);

      return () => window.clearTimeout(timer);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <main className="about-page">
      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-label">{t("about.hero.label")}</span>

          <h1>
            {t("about.hero.title")}
            <span>{t("about.hero.titleHighlight")}</span>
          </h1>

          <p>{t("about.hero.description")}</p>

          <div className="about-buttons">
            <Link to="/about/our-story" className="about-btn-primary">
              {t("about.hero.storyButton")}
            </Link>

            <Link to="/menu" className="about-btn-secondary">
              {t("about.hero.menuButton")}
            </Link>
          </div>
        </div>

        <div className="about-hero-image">
          <img src="/images/t3.jpg" alt={t("about.images.hero")} />

          <div className="about-image-caption">
            <span>{t("about.hero.imageCaption")}</span>
            <h3>{t("about.hero.imageTitle")}</h3>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="about-story" id="our-story">
        <div className="about-story-image">
          <img src="/images/t4.jpg" alt={t("about.images.story")} />
        </div>

        <div className="about-story-content">
          <span className="about-label">{t("about.story.label")}</span>

          <h2>{t("about.story.title")}</h2>

          <p>{t("about.story.paragraph1")}</p>

          <p>{t("about.story.paragraph2")}</p>

          <p>{t("about.story.paragraph3")}</p>

          <Link to="/about/why-choose-us" className="about-text-link">
            {t("about.story.link")} <span>→</span>
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="about-why" id="why-choose-us">
        <div className="about-heading">
          <span className="about-label">{t("about.why.label")}</span>

          <h2>{t("about.why.title")}</h2>

          <p>{t("about.why.description")}</p>
        </div>

        <div className="about-features">
          <article className="about-feature-card">
            <span className="about-feature-number">01</span>
            <h3>{t("about.why.features.homestyle.title")}</h3>
            <p>{t("about.why.features.homestyle.description")}</p>
          </article>

          <article className="about-feature-card">
            <span className="about-feature-number">02</span>
            <h3>{t("about.why.features.fresh.title")}</h3>
            <p>{t("about.why.features.fresh.description")}</p>
          </article>

          <article className="about-feature-card">
            <span className="about-feature-number">03</span>
            <h3>{t("about.why.features.care.title")}</h3>
            <p>{t("about.why.features.care.description")}</p>
          </article>

          <article className="about-feature-card">
            <span className="about-feature-number">04</span>
            <h3>{t("about.why.features.easy.title")}</h3>
            <p>{t("about.why.features.easy.description")}</p>
          </article>
        </div>
      </section>

      {/* OUR KITCHEN / FOOD GALLERY */}
      <section className="about-kitchen" id="our-kitchen">
        <div className="about-heading">
          <span className="about-label">{t("about.kitchen.label")}</span>

          <h2>{t("about.kitchen.title")}</h2>

          <p>{t("about.kitchen.description")}</p>
        </div>

        <div className="about-gallery">
          <div className="about-gallery-item about-gallery-large">
            <img src="/images/t3.jpg" alt={t("about.images.gallery1")} />
          </div>

          <div className="about-gallery-item">
            <img src="/images/meal.jpg" alt={t("about.images.gallery2")} />
          </div>

          <div className="about-gallery-item">
            <img src="/images/meal1.jpg" alt={t("about.images.gallery3")} />
          </div>

          <div className="about-gallery-item">
            <img src="/images/meal2.jpg" alt={t("about.images.gallery4")} />
          </div>

          <div className="about-gallery-item">
            <img src="/images/t7.jpg" alt={t("about.images.gallery5")} />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="about-cta">
        <span className="about-label">{t("about.cta.label")}</span>

        <h2>{t("about.cta.title")}</h2>

        <p>{t("about.cta.description")}</p>

        <Link to="/menu" className="about-btn-primary">
          {t("about.cta.button")}
        </Link>
      </section>
    </main>
  );
}

export default About;
