
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./DailyMeal.css";

const dailyMeals = [
  {
    id: 1,
    key: "vegDabba",
    price: 120,
    image: "/images/tiffin2.jpg",
  },
  {
    id: 2,
    key: "vegThali",
    price: 140,
    image: "/images/vegthali.jpg",
  },
  {
    id: 3,
    key: "healthyDabba",
    price: 100,
    image: "/images/tiffin1.jpg",
  },
] as const;

function DailyPlan() {
  const { t } = useTranslation();

  return (
    <main className="daily-plan-page">
      <section className="daily-plan-hero">
        <div className="container">
          <div className="daily-plan-hero-content">
            <span className="daily-plan-eyebrow">
              {t("dailyPlan.hero.eyebrow")}
            </span>

            <h1>
              {t("dailyPlan.hero.titleLine1")}
              <br />
              <span>{t("dailyPlan.hero.titleLine2")}</span>
            </h1>

            <p>{t("dailyPlan.hero.description")}</p>

            <a href="#daily-meals" className="daily-plan-btn">
              {t("dailyPlan.hero.button")}
              <i className="bi bi-arrow-down-right ms-2" />
            </a>

            <div className="daily-plan-highlights">
              <span>
                <i className="bi bi-check-circle-fill" />
                {t("dailyPlan.hero.highlight1")}
              </span>

              <span>
                <i className="bi bi-check-circle-fill" />
                {t("dailyPlan.hero.highlight2")}
              </span>

              <span>
                <i className="bi bi-check-circle-fill" />
                {t("dailyPlan.hero.highlight3")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="daily-meals-section" id="daily-meals">
        <div className="container">
          <div className="daily-section-heading text-center">
            <span className="daily-plan-eyebrow">
              {t("dailyPlan.meals.eyebrow")}
            </span>

            <h2>{t("dailyPlan.meals.title")}</h2>

            <p>{t("dailyPlan.meals.description")}</p>
          </div>

          <div className="row g-4">
            {dailyMeals.map((meal) => (
              <div className="col-12 col-md-6 col-lg-4" key={meal.id}>
                <article className="daily-meal-card">
                  <div className="daily-meal-image-wrap">
                    <img
                      src={meal.image}
                      alt={t(`dailyPlan.meals.items.${meal.key}.name`)}
                    />

                    <span className="daily-meal-tag">
                      {t(`dailyPlan.meals.items.${meal.key}.tag`)}
                    </span>
                  </div>

                  <div className="daily-meal-content">
                    <h3>
                      {t(`dailyPlan.meals.items.${meal.key}.name`)}
                    </h3>

                    <p>
                      {t(`dailyPlan.meals.items.${meal.key}.description`)}
                    </p>

                    <div className="daily-meal-bottom">
                      <div className="daily-meal-price">
                        <strong>₹{meal.price}</strong>
                        <span>{t("dailyPlan.meals.perMeal")}</span>
                      </div>

                      <Link
                        to="/contact"
                        className="daily-meal-order-btn"
                      >
                        {t("dailyPlan.meals.enquire")}
                        <i className="bi bi-arrow-up-right ms-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <p className="daily-plan-note">
            {t("dailyPlan.meals.note")}
          </p>
        </div>
      </section>

      <section className="daily-benefits-section">
        <div className="container">
          <div className="daily-section-heading text-center">
            <span className="daily-plan-eyebrow">
              {t("dailyPlan.benefits.eyebrow")}
            </span>

            <h2>{t("dailyPlan.benefits.title")}</h2>

            <p>{t("dailyPlan.benefits.description")}</p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="daily-benefit-card">
                <div className="daily-benefit-icon">
                  <i className="bi bi-egg-fried" />
                </div>

                <h3>{t("dailyPlan.benefits.freshTitle")}</h3>

                <p>{t("dailyPlan.benefits.freshDescription")}</p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="daily-benefit-card">
                <div className="daily-benefit-icon">
                  <i className="bi bi-heart" />
                </div>

                <h3>{t("dailyPlan.benefits.homeTitle")}</h3>

                <p>{t("dailyPlan.benefits.homeDescription")}</p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="daily-benefit-card">
                <div className="daily-benefit-icon">
                  <i className="bi bi-bicycle" />
                </div>

                <h3>{t("dailyPlan.benefits.easyTitle")}</h3>

                <p>{t("dailyPlan.benefits.easyDescription")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="daily-plan-cta">
        <div className="container">
          <div className="daily-plan-cta-content">
            <div>
              <span className="daily-plan-eyebrow">
                {t("dailyPlan.cta.eyebrow")}
              </span>

              <h2>{t("dailyPlan.cta.title")}</h2>

              <p>{t("dailyPlan.cta.description")}</p>
            </div>

            <Link to="/contact" className="daily-plan-btn">
              {t("dailyPlan.cta.button")}
              <i className="bi bi-arrow-up-right ms-2" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DailyPlan;
