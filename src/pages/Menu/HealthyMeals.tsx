
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./HealthyMeals.css";

type HealthyMeal = {
  id: number;
  key: string;
  price: number;
  image: string;
};

const healthyMeals: HealthyMeal[] = [
  {
    id: 1,
    key: "lunchBox",
    price: 130,
    image: "/images/t5.jpg",
  },
  {
    id: 2,
    key: "vegBowl",
    price: 140,
    image: "/images/t6.jpg",
  },
  {
    id: 3,
    key: "healthyTiffin",
    price: 110,
    image: "/images/t6.jpg",
  },
];

function HealthyMeals() {
  const { t } = useTranslation();

  const handleExploreMeals = () => {
    document
      .getElementById("healthy-meal-list")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="healthy-meals-page">
      {/* Hero Section */}
      <section className="healthy-meals-hero">
        <div className="container healthy-meals-hero-content">
          <span className="healthy-meals-kicker">
            {t("healthyMeals.hero.kicker")}
          </span>

          <h1>
            {t("healthyMeals.hero.title")}
            {" "}
            <span>{t("healthyMeals.hero.titleHighlight")}</span>
          </h1>

          <p>{t("healthyMeals.hero.description")}</p>

          <div className="healthy-meals-hero-actions">
            <button
              type="button"
              className="healthy-meals-primary-btn"
              onClick={handleExploreMeals}
            >
              {t("healthyMeals.hero.exploreButton")}
              <i className="bi bi-arrow-down-right"></i>
            </button>

            <Link to="/menu" className="healthy-meals-secondary-btn">
              {t("healthyMeals.hero.menuButton")}
            </Link>
          </div>

          <div className="healthy-meals-highlights">
            <span>
              <i className="bi bi-leaf"></i>
              {t("healthyMeals.hero.highlight1")}
            </span>

            <span>
              <i className="bi bi-heart"></i>
              {t("healthyMeals.hero.highlight2")}
            </span>

            <span>
              <i className="bi bi-house-heart"></i>
              {t("healthyMeals.hero.highlight3")}
            </span>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="healthy-meals-intro">
        <div className="container">
          <span className="healthy-meals-label">
            {t("healthyMeals.intro.eyebrow")}
          </span>

          <h2>
            {t("healthyMeals.intro.title")}
            {" "}
            <span>{t("healthyMeals.intro.titleHighlight")}</span>
          </h2>

          <p>{t("healthyMeals.intro.description")}</p>
        </div>
      </section>

      {/* Healthy Meals Catalog */}
      <section
        className="healthy-meals-catalog"
        id="healthy-meal-list"
      >
        <div className="container">
          <div className="healthy-meals-heading">
            <div>
              <span className="healthy-meals-label">
                {t("healthyMeals.catalog.eyebrow")}
              </span>

              <h2>{t("healthyMeals.catalog.title")}</h2>

              <p>{t("healthyMeals.catalog.description")}</p>
            </div>

            <Link to="/menu" className="healthy-meals-view-all">
              {t("healthyMeals.catalog.viewAll")}
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {healthyMeals.map((meal) => (
              <div className="col-md-6 col-lg-4" key={meal.id}>
                <article className="healthy-meal-card">
                  <div className="healthy-meal-image-wrap">
                    <img
                      src={meal.image}
                      alt={t(
                        `healthyMeals.catalog.items.${meal.key}.name`,
                      )}
                      className="healthy-meal-image"
                      loading="lazy"
                    />

                    <span className="healthy-meal-tag">
                      {t(
                        `healthyMeals.catalog.items.${meal.key}.tag`,
                      )}
                    </span>
                  </div>

                  <div className="healthy-meal-card-body">
                    <span className="healthy-meal-category">
                      {t("healthyMeals.catalog.category")}
                    </span>

                    <h3>
                      {t(
                        `healthyMeals.catalog.items.${meal.key}.name`,
                      )}
                    </h3>

                    <p>
                      {t(
                        `healthyMeals.catalog.items.${meal.key}.description`,
                      )}
                    </p>

                    <div className="healthy-meal-card-footer">
                      <div>
                        <span className="healthy-meal-price-label">
                          {t("healthyMeals.catalog.startingAt")}
                        </span>

                        <strong>₹{meal.price}</strong>

                        <small>
                          {t("healthyMeals.catalog.perMeal")}
                        </small>
                      </div>

                      <Link
                        to="/mealplans/dailyplan"
                        className="healthy-meal-order-btn"
                        aria-label={t(
                          "healthyMeals.catalog.orderLabel",
                          {
                            name: t(
                              `healthyMeals.catalog.items.${meal.key}.name`,
                            ),
                          },
                        )}
                      >
                        {t("healthyMeals.catalog.orderNow")}
                        <i className="bi bi-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <p className="healthy-meals-note">
            <i className="bi bi-info-circle"></i>
            {t("healthyMeals.catalog.note")}
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="healthy-meals-benefits">
        <div className="container">
          <div className="healthy-meals-benefits-heading">
            <span className="healthy-meals-label">
              {t("healthyMeals.benefits.eyebrow")}
            </span>

            <h2>{t("healthyMeals.benefits.title")}</h2>

            <p>{t("healthyMeals.benefits.description")}</p>
          </div>

          <div className="row g-4">
            <div className="col-sm-6 col-lg-3">
              <article className="healthy-benefit-card">
                <i className="bi bi-leaf"></i>

                <h3>
                  {t("healthyMeals.benefits.freshTitle")}
                </h3>

                <p>
                  {t("healthyMeals.benefits.freshDescription")}
                </p>
              </article>
            </div>

            <div className="col-sm-6 col-lg-3">
              <article className="healthy-benefit-card">
                <i className="bi bi-house-heart"></i>

                <h3>
                  {t("healthyMeals.benefits.homeTitle")}
                </h3>

                <p>
                  {t("healthyMeals.benefits.homeDescription")}
                </p>
              </article>
            </div>

            <div className="col-sm-6 col-lg-3">
              <article className="healthy-benefit-card">
                <i className="bi bi-clock"></i>

                <h3>
                  {t("healthyMeals.benefits.convenienceTitle")}
                </h3>

                <p>
                  {t("healthyMeals.benefits.convenienceDescription")}
                </p>
              </article>
            </div>

            <div className="col-sm-6 col-lg-3">
              <article className="healthy-benefit-card">
                <i className="bi bi-wallet2"></i>

                <h3>
                  {t("healthyMeals.benefits.optionsTitle")}
                </h3>

                <p>
                  {t("healthyMeals.benefits.optionsDescription")}
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="healthy-meals-cta">
        <div className="container">
          <div className="healthy-meals-cta-inner">
            <div>
              <span className="healthy-meals-label">
                {t("healthyMeals.cta.eyebrow")}
              </span>

              <h2>{t("healthyMeals.cta.title")}</h2>

              <p>{t("healthyMeals.cta.description")}</p>
            </div>

            <Link to="/menu" className="healthy-meals-cta-btn">
              {t("healthyMeals.cta.button")}
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HealthyMeals;
