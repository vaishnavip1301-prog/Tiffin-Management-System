
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./DailyTiffin.css";

type TiffinMeal = {
  id: number;
  key: string;
  price: number;
  image: string;
};

const dailyMeals: TiffinMeal[] = [
  {
    id: 1,
    key: "vegTiffin",
    price: 120,
    image: "/images/t3.jpg",
  },
  {
    id: 2,
    key: "miniTiffin",
    price: 80,
    image: "/images/t4.jpg",
  },
  {
    id: 3,
    key: "healthyTiffin",
    price: 110,
    image: "/images/t6.jpg",
  },
];

const DailyTiffin = () => {
  const { t } = useTranslation();

  return (
    <main className="daily-tiffin-page">
      {/* Hero Section */}
      <section className="daily-tiffin-hero">
        <div className="daily-tiffin-hero-overlay"></div>

        <div className="container daily-tiffin-hero-content">
          <span className="daily-tiffin-kicker">
            {t("dailyTiffin.hero.kicker")}
          </span>

          <h1>
            {t("dailyTiffin.hero.title")}
            {" "}
            <span>{t("dailyTiffin.hero.titleHighlight")}</span>
          </h1>

          <p>{t("dailyTiffin.hero.description")}</p>

          <div className="daily-tiffin-hero-buttons">
            <a href="#daily-meals" className="daily-tiffin-primary-btn">
              {t("dailyTiffin.hero.exploreButton")}
              <i className="bi bi-arrow-down-right"></i>
            </a>

            <Link
              to="/mealplans/dailyplan"
              className="daily-tiffin-secondary-btn"
            >
              {t("dailyTiffin.hero.plansButton")}
            </Link>
          </div>

          <div className="daily-tiffin-highlights">
            <span>
              <i className="bi bi-house-heart"></i>
              {t("dailyTiffin.hero.highlight1")}
            </span>

            <span>
              <i className="bi bi-egg-fried"></i>
              {t("dailyTiffin.hero.highlight2")}
            </span>

            <span>
              <i className="bi bi-heart"></i>
              {t("dailyTiffin.hero.highlight3")}
            </span>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="daily-tiffin-intro">
        <div className="container">
          <span className="daily-tiffin-section-label">
            {t("dailyTiffin.intro.eyebrow")}
          </span>

          <h2>
            {t("dailyTiffin.intro.title")}
            {" "}
            <span>{t("dailyTiffin.intro.titleHighlight")}</span>
          </h2>

          <p>{t("dailyTiffin.intro.description")}</p>
        </div>
      </section>

      {/* Daily Tiffin Meal Cards */}
      <section className="daily-tiffin-meals" id="daily-meals">
        <div className="container">
          <div className="daily-tiffin-section-heading">
            <div>
              <span className="daily-tiffin-section-label">
                {t("dailyTiffin.meals.eyebrow")}
              </span>

              <h2>{t("dailyTiffin.meals.title")}</h2>

              <p>{t("dailyTiffin.meals.description")}</p>
            </div>

            <Link to="/menu" className="daily-tiffin-view-all">
              {t("dailyTiffin.meals.viewAll")}
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {dailyMeals.map((meal) => (
              <div className="col-md-6 col-lg-4" key={meal.id}>
                <article className="daily-tiffin-card">
                  <div className="daily-tiffin-image-wrap">
                    <img
                      src={meal.image}
                      alt={t(`dailyTiffin.meals.items.${meal.key}.name`)}
                      className="daily-tiffin-image"
                      loading="lazy"
                    />

                    <span className="daily-tiffin-tag">
                      {t(`dailyTiffin.meals.items.${meal.key}.tag`)}
                    </span>
                  </div>

                  <div className="daily-tiffin-card-body">
                    <span className="daily-tiffin-card-category">
                      {t("dailyTiffin.meals.category")}
                    </span>

                    <h3>
                      {t(`dailyTiffin.meals.items.${meal.key}.name`)}
                    </h3>

                    <p>
                      {t(`dailyTiffin.meals.items.${meal.key}.description`)}
                    </p>

                    <div className="daily-tiffin-card-footer">
                      <div>
                        <span className="daily-tiffin-price-label">
                          {t("dailyTiffin.meals.startingAt")}
                        </span>

                        <strong className="daily-tiffin-price">
                          ₹{meal.price}
                        </strong>

                        <span className="daily-tiffin-price-note">
                          {t("dailyTiffin.meals.perMeal")}
                        </span>
                      </div>

                      <Link
                        to="/mealplans/dailyplan"
                        className="daily-tiffin-order-btn"
                        aria-label={t(
                          "dailyTiffin.meals.orderLabel",
                          {
                            name: t(
                              `dailyTiffin.meals.items.${meal.key}.name`,
                            ),
                          },
                        )}
                      >
                        {t("dailyTiffin.meals.orderNow")}
                        <i className="bi bi-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <p className="daily-tiffin-note">
            <i className="bi bi-info-circle"></i>
            {t("dailyTiffin.meals.note")}
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="daily-tiffin-benefits">
        <div className="container">
          <div className="daily-tiffin-benefits-heading">
            <span className="daily-tiffin-section-label">
              {t("dailyTiffin.benefits.eyebrow")}
            </span>

            <h2>{t("dailyTiffin.benefits.title")}</h2>

            <p>{t("dailyTiffin.benefits.description")}</p>
          </div>

          <div className="row g-4">
            <div className="col-sm-6 col-lg-3">
              <div className="daily-tiffin-benefit-card">
                <div className="daily-tiffin-benefit-icon">
                  <i className="bi bi-house-heart"></i>
                </div>

                <h3>{t("dailyTiffin.benefits.homeTitle")}</h3>

                <p>{t("dailyTiffin.benefits.homeDescription")}</p>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="daily-tiffin-benefit-card">
                <div className="daily-tiffin-benefit-icon">
                  <i className="bi bi-egg-fried"></i>
                </div>

                <h3>{t("dailyTiffin.benefits.freshTitle")}</h3>

                <p>{t("dailyTiffin.benefits.freshDescription")}</p>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="daily-tiffin-benefit-card">
                <div className="daily-tiffin-benefit-icon">
                  <i className="bi bi-clock"></i>
                </div>

                <h3>{t("dailyTiffin.benefits.convenienceTitle")}</h3>

                <p>{t("dailyTiffin.benefits.convenienceDescription")}</p>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="daily-tiffin-benefit-card">
                <div className="daily-tiffin-benefit-icon">
                  <i className="bi bi-wallet2"></i>
                </div>

                <h3>{t("dailyTiffin.benefits.optionsTitle")}</h3>

                <p>{t("dailyTiffin.benefits.optionsDescription")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="daily-tiffin-cta">
        <div className="container">
          <div className="daily-tiffin-cta-inner">
            <div>
              <span className="daily-tiffin-section-label">
                {t("dailyTiffin.cta.eyebrow")}
              </span>

              <h2>{t("dailyTiffin.cta.title")}</h2>

              <p>{t("dailyTiffin.cta.description")}</p>
            </div>

            <Link
              to="/mealplans/dailyplan"
              className="daily-tiffin-cta-btn"
            >
              {t("dailyTiffin.cta.button")}
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DailyTiffin;
