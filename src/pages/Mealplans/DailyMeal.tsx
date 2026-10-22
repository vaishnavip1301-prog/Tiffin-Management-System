
import { Link } from "react-router-dom";
import "./DailyMeal.css";

const dailyMeals = [
  {
    id: 1,
    name: "Daily Veg Dabba",
    description:
      "Enjoy fresh chapati, seasonal bhaji, dal and rice prepared with homemade flavours.",
    price: 120,
    image: "/images/tiffin2.jpg",
    tag: "Daily Favourite",
  },
  {
    id: 2,
    name: "Homestyle Veg Thali",
    description:
      "A delicious combination of fresh vegetables, soft rotis, dal and rice for a satisfying meal.",
    price: 140,
    image: "/images/vegthali.jpg",
    tag: "Most Popular",
  },
  {
    id: 3,
    name: "Simple Healthy Dabba",
    description:
      "Enjoy a wholesome everyday meal made with fresh ingredients and comforting homestyle taste.",
    price: 100,
    image: "/images/tiffin1.jpg",
    tag: "Healthy Choice",
  },
];

function DailyPlan() {
  return (
    <main className="daily-plan-page">
      <section className="daily-plan-hero">
        <div className="container">
          <div className="daily-plan-hero-content">
            <span className="daily-plan-eyebrow">
              FRESH FOOD, EVERY DAY
            </span>

            <h1>
              Good Food,
              <br />
              <span>Every Single Day.</span>
            </h1>

            <p>
              Enjoy the comfort of gharghuti jevaan with freshly prepared
              meals from Aapla Dabba. Choose your daily dabba and make
              every meal feel like home.
            </p>

            <a href="#daily-meals" className="daily-plan-btn">
              Explore Daily Meals
              <i className="bi bi-arrow-down-right ms-2" />
            </a>

            <div className="daily-plan-highlights">
              <span>
                <i className="bi bi-check-circle-fill" />
                Freshly Prepared
              </span>

              <span>
                <i className="bi bi-check-circle-fill" />
                Homemade Taste
              </span>

              <span>
                <i className="bi bi-check-circle-fill" />
                Everyday Convenience
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="daily-meals-section" id="daily-meals">
        <div className="container">
          <div className="daily-section-heading text-center">
            <span className="daily-plan-eyebrow">
              TODAY'S GOODNESS
            </span>

            <h2>Choose Your Daily Dabba</h2>

            <p>
              Fresh, delicious and satisfying meals to make your everyday
              food routine easier.
            </p>
          </div>

          <div className="row g-4">
            {dailyMeals.map((meal) => (
              <div className="col-12 col-md-6 col-lg-4" key={meal.id}>
                <article className="daily-meal-card">
                  <div className="daily-meal-image-wrap">
                    <img src={meal.image} alt={meal.name} />

                    <span className="daily-meal-tag">
                      {meal.tag}
                    </span>
                  </div>

                  <div className="daily-meal-content">
                    <h3>{meal.name}</h3>

                    <p>{meal.description}</p>

                    <div className="daily-meal-bottom">
                      <div className="daily-meal-price">
                        <strong>₹{meal.price}</strong>
                        <span>/ meal</span>
                      </div>

                      <Link
                        to="/contact"
                        className="daily-meal-order-btn"
                      >
                        Enquire Now
                        <i className="bi bi-arrow-up-right ms-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <p className="daily-plan-note">
            * Prices are sample prices. Confirm the menu and delivery
            availability before ordering.
          </p>
        </div>
      </section>

      <section className="daily-benefits-section">
        <div className="container">
          <div className="daily-section-heading text-center">
            <span className="daily-plan-eyebrow">
              WHY AAPLA DABBA?
            </span>

            <h2>Good Food, Made with Care</h2>

            <p>
              Enjoy a simple everyday meal experience with the comfort
              and flavour of home cooking.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="daily-benefit-card">
                <div className="daily-benefit-icon">
                  <i className="bi bi-egg-fried" />
                </div>

                <h3>Fresh Ingredients</h3>

                <p>
                  Meals prepared with fresh ingredients for a delicious
                  everyday dining experience.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="daily-benefit-card">
                <div className="daily-benefit-icon">
                  <i className="bi bi-heart" />
                </div>

                <h3>Homemade Taste</h3>

                <p>
                  Enjoy comforting flavours inspired by traditional
                  home-cooked Indian meals.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="daily-benefit-card">
                <div className="daily-benefit-icon">
                  <i className="bi bi-bicycle" />
                </div>

                <h3>Easy Everyday Meals</h3>

                <p>
                  Make your daily food routine simpler with convenient
                  meal options.
                </p>
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
                GHARGHUTI JEVAAN, ROJ NAVIN
              </span>

              <h2>Your daily dose of homemade goodness.</h2>

              <p>
                Have questions about our daily meals? Contact Aapla Dabba
                to learn more about available options.
              </p>
            </div>

            <Link to="/contact" className="daily-plan-btn">
              Contact Us
              <i className="bi bi-arrow-up-right ms-2" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DailyPlan;
