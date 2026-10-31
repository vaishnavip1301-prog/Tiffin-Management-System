
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./WeeklyPlan.css";

const weeklyMeals = [
  {
    id: 1,
    key: "homestyleDabba",
    price: 700,
    image: "/images/tiffin1.jpg",
  },
  {
    id: 2,
    key: "specialThali",
    price: 840,
    image: "/images/vegthali.jpg",
  },
  {
    id: 3,
    key: "healthyMeals",
    price: 700,
    image: "/images/tiffin2.jpg",
  },
];

function WeeklyPlan() {
  const { t } = useTranslation();

  return (
    <main className="weekly-plan-page">
      <section className="weekly-plan-hero">
        <div className="container">
          <div className="weekly-plan-hero-content">
            <span className="weekly-plan-eyebrow">
              {t("weeklyPlan.hero.eyebrow")}
            </span>

            <h1>
              {t("weeklyPlan.hero.titleLine1")}
              <br />
              <span>{t("weeklyPlan.hero.titleLine2")}</span>
            </h1>

            <p>{t("weeklyPlan.hero.description")}</p>

            <a href="#weekly-meals" className="weekly-plan-btn">
              {t("weeklyPlan.hero.button")}
              <i className="bi bi-arrow-down-right ms-2" />
            </a>

            <div className="weekly-plan-highlights">
              <span>
                <i className="bi bi-check-circle-fill" />
                {t("weeklyPlan.hero.highlight1")}
              </span>

              <span>
                <i className="bi bi-check-circle-fill" />
                {t("weeklyPlan.hero.highlight2")}
              </span>

              <span>
                <i className="bi bi-check-circle-fill" />
                {t("weeklyPlan.hero.highlight3")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="weekly-meals-section" id="weekly-meals">
        <div className="container">
          <div className="weekly-section-heading text-center">
            <span className="weekly-plan-eyebrow">
              {t("weeklyPlan.meals.eyebrow")}
            </span>

            <h2>{t("weeklyPlan.meals.title")}</h2>

            <p>{t("weeklyPlan.meals.description")}</p>
          </div>

          <div className="row g-4">
            {weeklyMeals.map((meal) => (
              <div className="col-12 col-md-6 col-lg-4" key={meal.id}>
                <article className="weekly-meal-card">
                  <div className="weekly-meal-image-wrap">
                    <img
                      src={meal.image}
                      alt={t(`weeklyPlan.meals.items.${meal.key}.name`)}
                    />

                    <span className="weekly-meal-tag">
                      {t(`weeklyPlan.meals.items.${meal.key}.tag`)}
                    </span>
                  </div>

                  <div className="weekly-meal-content">
                    <h3>
                      {t(`weeklyPlan.meals.items.${meal.key}.name`)}
                    </h3>

                    <p>
                      {t(`weeklyPlan.meals.items.${meal.key}.description`)}
                    </p>

                    <div className="weekly-meal-bottom">
                      <div className="weekly-meal-price">
                        <strong>
                          ₹{meal.price.toLocaleString("en-IN")}
                        </strong>
                        <span>{t("weeklyPlan.meals.perWeek")}</span>
                      </div>

                      <Link
                        to="/contact"
                        className="weekly-meal-order-btn"
                      >
                        {t("weeklyPlan.meals.enquire")}
                        <i className="bi bi-arrow-up-right ms-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <p className="weekly-plan-note">
            {t("weeklyPlan.meals.note")}
          </p>
        </div>
      </section>

      <section className="weekly-benefits-section">
        <div className="container">
          <div className="weekly-section-heading text-center">
            <span className="weekly-plan-eyebrow">
              {t("weeklyPlan.benefits.eyebrow")}
            </span>

            <h2>{t("weeklyPlan.benefits.title")}</h2>

            <p>{t("weeklyPlan.benefits.description")}</p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="weekly-benefit-card">
                <div className="weekly-benefit-icon">
                  <i className="bi bi-calendar-check" />
                </div>

                <h3>{t("weeklyPlan.benefits.planningTitle")}</h3>

                <p>{t("weeklyPlan.benefits.planningDescription")}</p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="weekly-benefit-card">
                <div className="weekly-benefit-icon">
                  <i className="bi bi-heart" />
                </div>

                <h3>{t("weeklyPlan.benefits.homeTitle")}</h3>

                <p>{t("weeklyPlan.benefits.homeDescription")}</p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="weekly-benefit-card">
                <div className="weekly-benefit-icon">
                  <i className="bi bi-bicycle" />
                </div>

                <h3>{t("weeklyPlan.benefits.convenienceTitle")}</h3>

                <p>{t("weeklyPlan.benefits.convenienceDescription")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="weekly-plan-cta">
        <div className="container">
          <div className="weekly-plan-cta-content">
            <div>
              <span className="weekly-plan-eyebrow">
                {t("weeklyPlan.cta.eyebrow")}
              </span>

              <h2>{t("weeklyPlan.cta.title")}</h2>

              <p>{t("weeklyPlan.cta.description")}</p>
            </div>

            <Link to="/contact" className="weekly-plan-btn">
              {t("weeklyPlan.cta.button")}
              <i className="bi bi-arrow-up-right ms-2" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default WeeklyPlan;
