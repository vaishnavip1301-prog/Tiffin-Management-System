
import { Link } from "react-router-dom";
import "./HealthyMeals.css";

type HealthyMeal = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  tag: string;
};

const healthyMeals: HealthyMeal[] = [
  {
    id: 1,
    name: "Healthy Lunch Box",
    description:
      "A balanced homemade meal prepared with fresh ingredients for your everyday routine.",
    price: 130,
    image: "/images/t5.jpg",
    tag: "Healthy Choice",
  },
  {
    id: 2,
    name: "Fresh Veg Bowl",
    description:
      "A wholesome combination of fresh vegetables and delicious home-style flavours.",
    price: 140,
    image: "/images/t6.jpg",
    tag: "Fresh & Light",
  },
  {
    id: 3,
    name: "Everyday Healthy Tiffin",
    description:
      "Enjoy a comforting meal with seasonal vegetables and familiar homemade taste.",
    price: 110,
    image: "/images/t6.jpg",
    tag: "Everyday Favourite",
  },
];

function HealthyMeals() {
  return (
    <main className="healthy-meals-page">
      <section className="healthy-meals-hero">
        <div className="container healthy-meals-hero-content">
          <span className="healthy-meals-kicker">
            FRESH • BALANCED • DELICIOUS
          </span>

          <h1>
            Eat Fresh. <span>Feel Good.</span>
          </h1>

          <p>
            Discover wholesome homemade meals made for your busy everyday
            routine. Fresh flavours, comforting food and delicious choices
            from Aapla Dabba.
          </p>

          <div className="healthy-meals-hero-actions">
            <button
            type="button"
            className="healthy-meals-primary-btn"
            onClick={() => {
                document
                .getElementById("healthy-meal-list")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            >
            Explore Healthy Meals
            <i className="bi bi-arrow-down-right"></i>
            </button>

            <Link to="/menu" className="healthy-meals-secondary-btn">
              View Full Menu
            </Link>
          </div>

          <div className="healthy-meals-highlights">
            <span><i className="bi bi-leaf"></i> Fresh Ingredients</span>
            <span><i className="bi bi-heart"></i> Made with Care</span>
            <span><i className="bi bi-house-heart"></i> Homemade Taste</span>
          </div>
        </div>
      </section>

      <section className="healthy-meals-intro">
        <div className="container">
          <span className="healthy-meals-label">A BETTER EVERYDAY MEAL</span>
          <h2>
            Simple Food. <span>Wholesome Choices.</span>
          </h2>
          <p>
            Make everyday meals easier with satisfying food prepared with
            care. Explore our selection and find a meal that suits your day.
          </p>
        </div>
      </section>

      <section
        className="healthy-meals-catalog"
        id="healthy-meal-list"
      >
        <div className="container">
          <div className="healthy-meals-heading">
            <div>
              <span className="healthy-meals-label">GOODNESS IN EVERY BITE</span>
              <h2>Explore Healthy Meals</h2>
              <p>Find your favourite wholesome meal from our selection.</p>
            </div>

            <Link to="/menu" className="healthy-meals-view-all">
              View All Meals <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {healthyMeals.map((meal) => (
              <div className="col-md-6 col-lg-4" key={meal.id}>
                <article className="healthy-meal-card">
                  <div className="healthy-meal-image-wrap">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="healthy-meal-image"
                      loading="lazy"
                    />
                    <span className="healthy-meal-tag">{meal.tag}</span>
                  </div>

                  <div className="healthy-meal-card-body">
                    <span className="healthy-meal-category">
                      HEALTHY MEALS
                    </span>

                    <h3>{meal.name}</h3>
                    <p>{meal.description}</p>

                    <div className="healthy-meal-card-footer">
                      <div>
                        <span className="healthy-meal-price-label">
                          Starting at
                        </span>
                        <strong>₹{meal.price}</strong>
                        <small>per meal</small>
                      </div>

                      <Link
                        to="/plans"
                        className="healthy-meal-order-btn"
                      >
                        Order Now <i className="bi bi-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <p className="healthy-meals-note">
            <i className="bi bi-info-circle"></i>
            Meal ingredients and availability may vary depending on the day's menu.
          </p>
        </div>
      </section>

      <section className="healthy-meals-benefits">
        <div className="container">
          <div className="healthy-meals-benefits-heading">
            <span className="healthy-meals-label">WHY AAPLA DABBA</span>
            <h2>Good Food for Your Everyday Routine</h2>
            <p>
              Enjoy the comfort of familiar meals with convenient everyday
              options.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-sm-6 col-lg-3">
              <article className="healthy-benefit-card">
                <i className="bi bi-leaf"></i>
                <h3>Fresh Choices</h3>
                <p>Explore meals featuring vegetables and familiar ingredients.</p>
              </article>
            </div>

            <div className="col-sm-6 col-lg-3">
              <article className="healthy-benefit-card">
                <i className="bi bi-house-heart"></i>
                <h3>Homestyle Flavours</h3>
                <p>Enjoy comforting food inspired by everyday home cooking.</p>
              </article>
            </div>

            <div className="col-sm-6 col-lg-3">
              <article className="healthy-benefit-card">
                <i className="bi bi-clock"></i>
                <h3>Everyday Convenience</h3>
                <p>Make meal planning easier when your schedule gets busy.</p>
              </article>
            </div>

            <div className="col-sm-6 col-lg-3">
              <article className="healthy-benefit-card">
                <i className="bi bi-wallet2"></i>
                <h3>Flexible Options</h3>
                <p>Choose from different meals to suit your everyday needs.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="healthy-meals-cta">
        <div className="container">
          <div className="healthy-meals-cta-inner">
            <div>
              <span className="healthy-meals-label">YOUR NEXT MEAL AWAITS</span>
              <h2>Make Room for Something Fresh.</h2>
              <p>Explore our complete menu and choose your next favourite.</p>
            </div>

            <Link to="/menu" className="healthy-meals-cta-btn">
              Explore Our Menu <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HealthyMeals;
