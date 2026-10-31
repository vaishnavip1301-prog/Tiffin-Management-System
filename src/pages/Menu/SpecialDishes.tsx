
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./SpecialDishes.css";

type SpecialDish = {
  id: number;
  key: string;
  price: number;
  image: string;
};

const specialDishes: SpecialDish[] = [
  {
    id: 1,
    key: "maharashtrianThali",
    price: 160,
    image: "/images/t3.jpg",
  },
  {
    id: 2,
    key: "specialVegThali",
    price: 180,
    image: "/images/t4.jpg",
  },
  {
    id: 3,
    key: "premiumFamilyMeal",
    price: 250,
    image: "/images/t6.jpg",
  },
];

function SpecialDishes() {
  const { t } = useTranslation();

  const exploreDishes = () => {
    document
      .getElementById("special-dishes-list")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="special-dishes-page">
      {/* Hero Section */}
      <section className="special-dishes-hero">
        <div className="container special-dishes-hero-content">
          <span className="special-dishes-kicker">
            {t("specialDishes.hero.kicker")}
          </span>

          <h1>
            {t("specialDishes.hero.title")}
            {" "}
            <span>{t("specialDishes.hero.titleHighlight")}</span>
          </h1>

          <p>{t("specialDishes.hero.description")}</p>

          <div className="special-dishes-hero-actions">
            <button
              type="button"
              className="special-dishes-primary-btn"
              onClick={exploreDishes}
            >
              {t("specialDishes.hero.exploreButton")}
              <i className="bi bi-arrow-down-right"></i>
            </button>

            <Link to="/menu" className="special-dishes-secondary-btn">
              {t("specialDishes.hero.menuButton")}
            </Link>
          </div>

          <div className="special-dishes-highlights">
            <span>
              <i className="bi bi-egg-fried"></i>
              {t("specialDishes.hero.highlight1")}
            </span>

            <span>
              <i className="bi bi-house-heart"></i>
              {t("specialDishes.hero.highlight2")}
            </span>

            <span>
              <i className="bi bi-heart"></i>
              {t("specialDishes.hero.highlight3")}
            </span>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="special-dishes-intro">
        <div className="container">
          <span className="special-dishes-label">
            {t("specialDishes.intro.eyebrow")}
          </span>

          <h2>
            {t("specialDishes.intro.title")}
            {" "}
            <span>{t("specialDishes.intro.titleHighlight")}</span>
          </h2>

          <p>{t("specialDishes.intro.description")}</p>
        </div>
      </section>

      {/* Special Dishes List */}
      <section
        className="special-dishes-catalog"
        id="special-dishes-list"
      >
        <div className="container">
          <div className="special-dishes-heading">
            <div>
              <span className="special-dishes-label">
                {t("specialDishes.catalog.eyebrow")}
              </span>

              <h2>{t("specialDishes.catalog.title")}</h2>

              <p>{t("specialDishes.catalog.description")}</p>
            </div>

            <Link to="/menu" className="special-dishes-view-all">
              {t("specialDishes.catalog.viewAll")}
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {specialDishes.map((dish) => (
              <div className="col-md-6 col-lg-4" key={dish.id}>
                <article className="special-dish-card">
                  <div className="special-dish-image-wrap">
                    <img
                      src={dish.image}
                      alt={t(
                        `specialDishes.catalog.items.${dish.key}.name`,
                      )}
                      className="special-dish-image"
                      loading="lazy"
                    />

                    <span className="special-dish-tag">
                      {t(
                        `specialDishes.catalog.items.${dish.key}.tag`,
                      )}
                    </span>
                  </div>

                  <div className="special-dish-card-body">
                    <span className="special-dish-category">
                      {t("specialDishes.catalog.category")}
                    </span>

                    <h3>
                      {t(
                        `specialDishes.catalog.items.${dish.key}.name`,
                      )}
                    </h3>

                    <p>
                      {t(
                        `specialDishes.catalog.items.${dish.key}.description`,
                      )}
                    </p>

                    <div className="special-dish-card-footer">
                      <div className="special-dish-price-wrap">
                        <span>
                          {t("specialDishes.catalog.startingAt")}
                        </span>

                        <strong>₹{dish.price}</strong>

                        <small>
                          {t("specialDishes.catalog.perMeal")}
                        </small>
                      </div>

                      <Link
                        to="/menu"
                        className="special-dish-order-btn"
                        aria-label={t(
                          "specialDishes.catalog.orderLabel",
                          {
                            name: t(
                              `specialDishes.catalog.items.${dish.key}.name`,
                            ),
                          },
                        )}
                      >
                        {t("specialDishes.catalog.orderNow")}
                        <i className="bi bi-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <p className="special-dishes-note">
            <i className="bi bi-info-circle"></i>
            {t("specialDishes.catalog.note")}
          </p>
        </div>
      </section>

      {/* Why Choose Special Dishes */}
      <section className="special-dishes-benefits">
        <div className="container">
          <div className="special-dishes-benefits-heading">
            <span className="special-dishes-label">
              {t("specialDishes.benefits.eyebrow")}
            </span>

            <h2>{t("specialDishes.benefits.title")}</h2>

            <p>{t("specialDishes.benefits.description")}</p>
          </div>

          <div className="row g-4">
            <div className="col-sm-6 col-lg-3">
              <article className="special-dish-benefit-card">
                <i className="bi bi-egg-fried"></i>

                <h3>
                  {t("specialDishes.benefits.varietyTitle")}
                </h3>

                <p>
                  {t("specialDishes.benefits.varietyDescription")}
                </p>
              </article>
            </div>

            <div className="col-sm-6 col-lg-3">
              <article className="special-dish-benefit-card">
                <i className="bi bi-house-heart"></i>

                <h3>
                  {t("specialDishes.benefits.homeTitle")}
                </h3>

                <p>
                  {t("specialDishes.benefits.homeDescription")}
                </p>
              </article>
            </div>

            <div className="col-sm-6 col-lg-3">
              <article className="special-dish-benefit-card">
                <i className="bi bi-people"></i>

                <h3>
                  {t("specialDishes.benefits.sharingTitle")}
                </h3>

                <p>
                  {t("specialDishes.benefits.sharingDescription")}
                </p>
              </article>
            </div>

            <div className="col-sm-6 col-lg-3">
              <article className="special-dish-benefit-card">
                <i className="bi bi-heart"></i>

                <h3>
                  {t("specialDishes.benefits.careTitle")}
                </h3>

                <p>
                  {t("specialDishes.benefits.careDescription")}
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="special-dishes-cta">
        <div className="container">
          <div className="special-dishes-cta-inner">
            <div>
              <span className="special-dishes-label">
                {t("specialDishes.cta.eyebrow")}
              </span>

              <h2>{t("specialDishes.cta.title")}</h2>

              <p>{t("specialDishes.cta.description")}</p>
            </div>

            <Link to="/menu" className="special-dishes-cta-btn">
              {t("specialDishes.cta.button")}
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SpecialDishes;
