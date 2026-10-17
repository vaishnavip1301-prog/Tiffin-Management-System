
import { Link } from "react-router-dom";
import "./DailyTiffin.css";

type TiffinMeal = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  tag: string;
};

const dailyMeals: TiffinMeal[] = [
  {
    id: 1,
    name: "Daily Veg Tiffin",
    description:
      "Fresh chapati, seasonal sabzi, dal and rice for a satisfying homemade lunch.",
    price: 120,
    image: "/images/t3.jpg",
    tag: "Popular",
  },
  {
    id: 2,
    name: "Mini Tiffin",
    description:
      "A simple, tasty and budget-friendly homemade meal for your everyday routine.",
    price: 80,
    image: "/images/t4.jpg",
    tag: "Budget Friendly",
  },
  {
    id: 3,
    name: "Everyday Healthy Tiffin",
    description:
      "A wholesome combination of fresh vegetables and comforting home-style food.",
    price: 110,
    image: "/images/t6.jpg",
    tag: "Healthy Choice",
  },
];

const DailyTiffin = () => {
  return (
    <main className="daily-tiffin-page">
      {/* Hero Section */}
      <section className="daily-tiffin-hero">
        <div className="daily-tiffin-hero-overlay"></div>

        <div className="container daily-tiffin-hero-content">
          <span className="daily-tiffin-kicker">
            FRESH • HOMEMADE • EVERYDAY
          </span>

          <h1>
            Your Daily Dose of <span>Homemade Happiness</span>
          </h1>

          <p>
            Enjoy fresh, comforting meals made with care.
            Bring the taste of ghar ka khana to your everyday routine.
          </p>

          <div className="daily-tiffin-hero-buttons">
            <a href="#daily-meals" className="daily-tiffin-primary-btn">
              Explore Daily Meals
              <i className="bi bi-arrow-down-right"></i>
            </a>

            <Link to="/plans" className="daily-tiffin-secondary-btn">
              View Meal Plans
            </Link>
          </div>

          <div className="daily-tiffin-highlights">
            <span>
              <i className="bi bi-house-heart"></i>
              Homestyle Taste
            </span>
            <span>
              <i className="bi bi-egg-fried"></i>
              Freshly Prepared
            </span>
            <span>
              <i className="bi bi-heart"></i>
              Made with Care
            </span>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="daily-tiffin-intro">
        <div className="container">
          <span className="daily-tiffin-section-label">
            YOUR EVERYDAY FOOD PARTNER
          </span>

          <h2>
            Good Food. <span>Every Single Day.</span>
          </h2>

          <p>
            Busy schedule? Missing homemade food? Aapla Dabba brings you
            everyday meals with familiar flavours, fresh ingredients and
            the comfort of a home-cooked meal.
          </p>
        </div>
      </section>

      {/* Daily Tiffin Meal Cards */}
      <section className="daily-tiffin-meals" id="daily-meals">
        <div className="container">
          <div className="daily-tiffin-section-heading">
            <div>
              <span className="daily-tiffin-section-label">
                MADE FRESH FOR YOU
              </span>
              <h2>Choose Your Daily Tiffin</h2>
              <p>
                Find a meal that suits your appetite and your everyday needs.
              </p>
            </div>

            <Link to="/menu" className="daily-tiffin-view-all">
              View All Meals
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
                      alt={meal.name}
                      className="daily-tiffin-image"
                      loading="lazy"
                    />
                    <span className="daily-tiffin-tag">{meal.tag}</span>
                  </div>

                  <div className="daily-tiffin-card-body">
                    <span className="daily-tiffin-card-category">
                      DAILY TIFFIN
                    </span>

                    <h3>{meal.name}</h3>
                    <p>{meal.description}</p>

                    <div className="daily-tiffin-card-footer">
                      <div>
                        <span className="daily-tiffin-price-label">
                          Starting at
                        </span>
                        <strong className="daily-tiffin-price">
                          ₹{meal.price}
                        </strong>
                        <span className="daily-tiffin-price-note">
                          per meal
                        </span>
                      </div>

                      <Link
                        to="/plans"
                        className="daily-tiffin-order-btn"
                        aria-label={`Order ${meal.name}`}
                      >
                        Order Now
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
            Meal contents may vary depending on the day's menu.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="daily-tiffin-benefits">
        <div className="container">
          <div className="daily-tiffin-benefits-heading">
            <span className="daily-tiffin-section-label">
              THE AAPLA DABBA DIFFERENCE
            </span>

            <h2>Everyday Meals, Made Better</h2>

            <p>
              Simple food, familiar flavours and thoughtful preparation
              for your daily routine.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-sm-6 col-lg-3">
              <div className="daily-tiffin-benefit-card">
                <div className="daily-tiffin-benefit-icon">
                  <i className="bi bi-house-heart"></i>
                </div>
                <h3>Homemade Taste</h3>
                <p>
                  Enjoy comforting flavours inspired by everyday home cooking.
                </p>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="daily-tiffin-benefit-card">
                <div className="daily-tiffin-benefit-icon">
                  <i className="bi bi-egg-fried"></i>
                </div>
                <h3>Fresh Meals</h3>
                <p>
                  Meals prepared with care for your everyday dining needs.
                </p>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="daily-tiffin-benefit-card">
                <div className="daily-tiffin-benefit-icon">
                  <i className="bi bi-clock"></i>
                </div>
                <h3>Everyday Convenience</h3>
                <p>
                  Make meal planning easier when work or studies keep you busy.
                </p>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="daily-tiffin-benefit-card">
                <div className="daily-tiffin-benefit-icon">
                  <i className="bi bi-wallet2"></i>
                </div>
                <h3>Everyday Options</h3>
                <p>
                  Choose from different meal options to suit your budget.
                </p>
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
                YOUR HOMEMADE MEAL AWAITS
              </span>
              <h2>Make Every Meal Feel Like Home.</h2>
              <p>
                Explore our meal options and find your everyday favourite.
              </p>
            </div>

            <Link to="/plans" className="daily-tiffin-cta-btn">
              Explore Meal Plans
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DailyTiffin;
