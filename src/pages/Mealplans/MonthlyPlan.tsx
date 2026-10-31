
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./MonthlyPlan.css";

const monthlyMeals = [
  {
    id: 1,
    key: "vegDabba",
    price: 2800,
    image: "/images/tiffin.jpg",
  },
  {
    id: 2,
    key: "specialThali",
    price: 3200,
    image: "/images/vegthali.jpg",
  },
  {
    id: 3,
    key: "healthyMeals",
    price: 3000,
    image: "/images/tiffin2.jpg",
  },
];

function MonthlyPlan() {
  const { t } = useTranslation();

  return (
    <main className="monthly-plan-page">
      {/* Hero Section */}
      <section className="monthly-plan-hero">
        <div className="container">
          <div className="monthly-plan-hero-content">
            <span className="monthly-plan-eyebrow">
              {t("monthlyPlan.hero.eyebrow")}
            </span>

            <h1>
              {t("monthlyPlan.hero.titleLine1")}
              <br />
              <span>{t("monthlyPlan.hero.titleLine2")}</span>
            </h1>

            <p>{t("monthlyPlan.hero.description")}</p>

            <a href="#monthly-meals" className="monthly-plan-btn">
              {t("monthlyPlan.hero.button")}
              <i className="bi bi-arrow-down-right ms-2" />
            </a>

            <div className="monthly-plan-highlights">
              <span>
                <i className="bi bi-check-circle-fill" />
                {t("monthlyPlan.hero.highlight1")}
              </span>

              <span>
                <i className="bi bi-check-circle-fill" />
                {t("monthlyPlan.hero.highlight2")}
              </span>

              <span>
                <i className="bi bi-check-circle-fill" />
                {t("monthlyPlan.hero.highlight3")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Meals Section */}
      <section className="monthly-meals-section" id="monthly-meals">
        <div className="container">
          <div className="monthly-section-heading text-center">
            <span className="monthly-plan-eyebrow">
              {t("monthlyPlan.meals.eyebrow")}
            </span>

            <h2>{t("monthlyPlan.meals.title")}</h2>

            <p>{t("monthlyPlan.meals.description")}</p>
          </div>

          <div className="row g-4">
            {monthlyMeals.map((meal) => (
              <div className="col-12 col-md-6 col-lg-4" key={meal.id}>
                <article className="monthly-meal-card">
                  <div className="monthly-meal-image-wrap">
                    <img
                      src={meal.image}
                      alt={t(`monthlyPlan.meals.items.${meal.key}.name`)}
                    />

                    <span className="monthly-meal-tag">
                      {t(`monthlyPlan.meals.items.${meal.key}.tag`)}
                    </span>
                  </div>

                  <div className="monthly-meal-content">
                    <h3>
                      {t(`monthlyPlan.meals.items.${meal.key}.name`)}
                    </h3>

                    <p>
                      {t(`monthlyPlan.meals.items.${meal.key}.description`)}
                    </p>

                    <div className="monthly-meal-bottom">
                      <div className="monthly-meal-price">
                        <strong>
                          ₹{meal.price.toLocaleString("en-IN")}
                        </strong>

                        <span>
                          {t("monthlyPlan.meals.perMonth")}
                        </span>
                      </div>

                      <Link
                        to="/contact"
                        className="monthly-meal-order-btn"
                      >
                        {t("monthlyPlan.meals.enquire")}
                        <i className="bi bi-arrow-up-right ms-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <p className="monthly-plan-note">
            {t("monthlyPlan.meals.note")}
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="monthly-benefits-section">
        <div className="container">
          <div className="monthly-section-heading text-center">
            <span className="monthly-plan-eyebrow">
              {t("monthlyPlan.benefits.eyebrow")}
            </span>

            <h2>{t("monthlyPlan.benefits.title")}</h2>

            <p>{t("monthlyPlan.benefits.description")}</p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="monthly-benefit-card">
                <div className="monthly-benefit-icon">
                  <i className="bi bi-calendar2-check" />
                </div>

                <h3>
                  {t("monthlyPlan.benefits.planningTitle")}
                </h3>

                <p>
                  {t("monthlyPlan.benefits.planningDescription")}
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="monthly-benefit-card">
                <div className="monthly-benefit-icon">
                  <i className="bi bi-heart" />
                </div>

                <h3>
                  {t("monthlyPlan.benefits.homeTitle")}
                </h3>

                <p>
                  {t("monthlyPlan.benefits.homeDescription")}
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="monthly-benefit-card">
                <div className="monthly-benefit-icon">
                  <i className="bi bi-clock-history" />
                </div>

                <h3>
                  {t("monthlyPlan.benefits.convenienceTitle")}
                </h3>

                <p>
                  {t("monthlyPlan.benefits.convenienceDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="monthly-plan-cta">
        <div className="container">
          <div className="monthly-plan-cta-content">
            <div>
              <span className="monthly-plan-eyebrow">
                {t("monthlyPlan.cta.eyebrow")}
              </span>

              <h2>{t("monthlyPlan.cta.title")}</h2>

              <p>{t("monthlyPlan.cta.description")}</p>
            </div>

            <Link to="/contact" className="monthly-plan-btn">
              {t("monthlyPlan.cta.button")}
              <i className="bi bi-arrow-up-right ms-2" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MonthlyPlan;
