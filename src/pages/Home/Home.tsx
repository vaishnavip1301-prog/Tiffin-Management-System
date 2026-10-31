import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Home.css";

function Home() {
  const { t } = useTranslation();

  const mealPlans = [
    {
      name: t("home.mealPlans.daily.name"),
      description: t("home.mealPlans.daily.description"),
      price: "₹120",
      period: t("home.mealPlans.daily.period"),
      image: "/images/tiffin2.jpg",
      icon: "bi-sun",
      tag: t("home.mealPlans.daily.tag"),
      link: "/mealplans/dailyplan",
    },
    {
      name: t("home.mealPlans.weekly.name"),
      description: t("home.mealPlans.weekly.description"),
      price: "₹700",
      period: t("home.mealPlans.weekly.period"),
      image: "/images/tiffin1.jpg",
      icon: "bi-calendar-week",
      tag: t("home.mealPlans.weekly.tag"),
      link: "/mealplans/weeklyplan",
    },
    {
      name: t("home.mealPlans.monthly.name"),
      description: t("home.mealPlans.monthly.description"),
      price: "₹2,800",
      period: t("home.mealPlans.monthly.period"),
      image: "/images/tiffin.jpg",
      icon: "bi-calendar-heart",
      tag: t("home.mealPlans.monthly.tag"),
      link: "/mealplans/monthlyplan",
    },
  ];

  const benefits = [
    {
      icon: "bi-leaf",
      title: t("home.benefits.fresh.title"),
      description: t("home.benefits.fresh.description"),
    },
    {
      icon: "bi-heart",
      title: t("home.benefits.homemade.title"),
      description: t("home.benefits.homemade.description"),
    },
    {
      icon: "bi-shield-check",
      title: t("home.benefits.hygienic.title"),
      description: t("home.benefits.hygienic.description"),
    },
    {
      icon: "bi-truck",
      title: t("home.benefits.delivery.title"),
      description: t("home.benefits.delivery.description"),
    },
  ];

  const specialDishes = [
    {
      name: t("home.specialDishes.vegThali.name"),
      description: t("home.specialDishes.vegThali.description"),
      price: "₹120",
      image: "/images/vegthali.jpg",
    },
    {
      name: t("home.specialDishes.healthyBowl.name"),
      description: t("home.specialDishes.healthyBowl.description"),
      price: "₹100",
      image: "/images/HealthyBowl.jpg",
    },
    {
      name: t("home.specialDishes.indianSpecial.name"),
      description: t("home.specialDishes.indianSpecial.description"),
      price: "₹150",
      image: "/images/IndianSpecial.jpg",
    },
  ];

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 hero-copy">
              <div className="hero-label">
                <i className="bi bi-leaf-fill"></i>
                {t("home.hero.label")}
              </div>

              <h1>
                {t("home.hero.title")}
                <span>{t("home.hero.titleHighlight")}</span>
              </h1>

              <p className="hero-description">
                {t("home.hero.description")}
              </p>

              <div className="hero-actions">
                <Link to="/menu" className="btn home-primary-btn">
                  {t("home.hero.exploreMenu")}
                  <i className="bi bi-arrow-right"></i>
                </Link>

                <Link
                  to="/mealplans/dailyplan"
                  className="btn home-outline-btn"
                >
                  <i className="bi bi-calendar-check"></i>
                  {t("home.hero.viewPlans")}
                </Link>
              </div>

              <div className="hero-note">
                <span className="hero-note-icon">
                  <i className="bi bi-heart-fill"></i>
                </span>
                <span>
                  <strong>{t("home.hero.careTitle")}</strong>
                  <small>{t("home.hero.careDescription")}</small>
                </span>
              </div>
            </div>

            <div className="col-lg-6 hero-visual">
              <div className="hero-image-frame">
                <img
                  src="/images/tiffin4.jpg"
                  alt={t("home.hero.imageAlt")}
                  className="hero-food-image"
                />

                <div className="hero-image-badge">
                  <i className="bi bi-stars"></i>
                  <span>
                    <strong>{t("home.hero.badgeTitle")}</strong>
                    <small>{t("home.hero.badgeDescription")}</small>
                  </span>
                </div>

                <div className="hero-floating-leaf hero-leaf-one">
                  <i className="bi bi-flower1"></i>
                </div>

                <div className="hero-floating-leaf hero-leaf-two">
                  <i className="bi bi-leaf"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="home-benefits">
        <div className="container-fluid px-4 px-lg-5">
          <div className="row g-3">
            {benefits.map((benefit, index) => (
              <div className="col-6 col-lg-3" key={benefit.title}>
                <div className="benefit-item" data-delay={index}>
                  <div className="benefit-icon">
                    <i className={`bi ${benefit.icon}`}></i>
                  </div>

                  <div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOMEMADE FOOD VIDEO SECTION */}
      <section className="home-food-video-section">
        <video
          className="home-food-video"
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
          poster="/images/tiffin4.jpg"
        >
          <source src="/videos/video.mp4" type="video/mp4" />
          {t("home.videoFallback")}
        </video>
      </section>

      {/* MEAL PLANS */}
      <section className="home-plans section-padding">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                <i className="bi bi-flower1"></i>{" "}
                {t("home.mealPlans.headingLabel")}
              </span>

              <h2>
                {t("home.mealPlans.heading")}
                <span>{t("home.mealPlans.headingHighlight")}</span>
              </h2>

              <p>{t("home.mealPlans.headingDescription")}</p>
            </div>

            <Link to="/mealplans/dailyplan" className="section-link">
              {t("home.mealPlans.exploreAll")}
              <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {mealPlans.map((plan, index) => (
              <div className="col-md-6 col-lg-4" key={plan.name}>
                <article className="meal-plan-card" data-delay={index}>
                  <div className="meal-plan-image-wrap">
                    <img src={plan.image} alt={plan.name} />

                    <span className="meal-plan-tag">{plan.tag}</span>
                  </div>

                  <div className="meal-plan-content">
                    <div className="meal-plan-title">
                      <span className="meal-plan-icon">
                        <i className={`bi ${plan.icon}`}></i>
                      </span>

                      <h3>{plan.name}</h3>
                    </div>

                    <p>{plan.description}</p>

                    <div className="meal-plan-bottom">
                      <div className="meal-plan-price">
                        <strong>{plan.price}</strong>
                        <span>{plan.period}</span>
                      </div>

                      <Link
                        to={plan.link}
                        className="meal-plan-order"
                        aria-label={t("home.mealPlans.explorePlan", {
                          plan: plan.name,
                        })}
                      >
                        {t("home.mealPlans.explore")}
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TODAY'S SPECIAL */}
      <section className="home-special">
        <div className="container">
          <div className="special-heading">
            <span className="section-eyebrow">
              <i className="bi bi-fire"></i>{" "}
              {t("home.specialDishes.headingLabel")}
            </span>

            <h2>{t("home.specialDishes.heading")}</h2>

            <p>{t("home.specialDishes.headingDescription")}</p>
          </div>

          <div className="row g-4">
            {specialDishes.map((dish, index) => (
              <div className="col-md-6 col-lg-4" key={dish.name}>
                <article className="special-card" data-delay={index}>
                  <img src={dish.image} alt={dish.name} />

                  <div className="special-card-content">
                    <h3>{dish.name}</h3>
                    <p>{dish.description}</p>

                    <div className="special-card-bottom">
                      <strong>{dish.price}</strong>

                      <Link
                        to="/menu"
                        aria-label={t("home.specialDishes.viewDish", {
                          dish: dish.name,
                        })}
                      >
                        {t("home.specialDishes.viewMenu")}
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="home-cta-section">
        <div className="container">
          <div className="home-cta">
            <div className="home-cta-icon">
              <i className="bi bi-basket2"></i>
            </div>

            <div className="home-cta-copy">
              <span>{t("home.cta.label")}</span>
              <h2>{t("home.cta.title")}</h2>
              <p>{t("home.cta.description")}</p>
            </div>

            <Link to="/contact" className="btn home-cta-btn">
              {t("home.cta.button")}
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;