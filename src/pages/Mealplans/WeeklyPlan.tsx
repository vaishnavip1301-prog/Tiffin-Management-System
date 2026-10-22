
import { Link } from "react-router-dom";
import "./WeeklyPlan.css";

const weeklyMeals = [
  {
    id: 1,
    name: "Homestyle Weekly Dabba",
    description:
      "Enjoy fresh chapati, seasonal bhaji, dal and rice with homemade flavour throughout the week.",
    price: 700,
    image: "/images/tiffin1.jpg",
    tag: "Most Popular",
  },
  {
    id: 2,
    name: "Special Veg Thali",
    description:
      "A satisfying combination of fresh vegetables, soft rotis, dal and rice for your everyday meals.",
    price: 840,
    image: "/images/vegthali.jpg",
    tag: "Homemade Favourite",
  },
  {
    id: 3,
    name: "Healthy Weekly Meals",
    description:
      "Wholesome meals made with fresh ingredients for your busy everyday routine.",
    price: 700,
    image: "/images/tiffin2.jpg",
    tag: "Healthy Choice",
  },
];

function WeeklyPlan() {
  return (
    <main className="weekly-plan-page">
      <section className="weekly-plan-hero">
        <div className="container">
          <div className="weekly-plan-hero-content">
            <span className="weekly-plan-eyebrow">
              YOUR WEEKLY MEAL SOLUTION
            </span>

            <h1>
              One Week,
              <br />
              <span>Full of Homemade Goodness.</span>
            </h1>

            <p>
              Make every day delicious with fresh gharghuti jevaan.
              Choose your weekly meal plan and enjoy homemade comfort
              without the everyday cooking hassle.
            </p>

            <a href="#weekly-meals" className="weekly-plan-btn">
              Explore Weekly Plans
              <i className="bi bi-arrow-down-right ms-2" />
            </a>

            <div className="weekly-plan-highlights">
              <span>
                <i className="bi bi-check-circle-fill" />
                Freshly Prepared
              </span>

              <span>
                <i className="bi bi-check-circle-fill" />
                Weekly Convenience
              </span>

              <span>
                <i className="bi bi-check-circle-fill" />
                Homemade Taste
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="weekly-meals-section" id="weekly-meals">
        <div className="container">
          <div className="weekly-section-heading text-center">
            <span className="weekly-plan-eyebrow">
              GOOD FOOD, ALL WEEK
            </span>

            <h2>Choose Your Weekly Dabba</h2>

            <p>
              Delicious homemade meals to make your entire week
              simpler, fresher and more satisfying.
            </p>
          </div>

          <div className="row g-4">
            {weeklyMeals.map((meal) => (
              <div className="col-12 col-md-6 col-lg-4" key={meal.id}>
                <article className="weekly-meal-card">
                  <div className="weekly-meal-image-wrap">
                    <img src={meal.image} alt={meal.name} />

                    <span className="weekly-meal-tag">
                      {meal.tag}
                    </span>
                  </div>

                  <div className="weekly-meal-content">
                    <h3>{meal.name}</h3>

                    <p>{meal.description}</p>

                    <div className="weekly-meal-bottom">
                      <div className="weekly-meal-price">
                        <strong>
                          ₹{meal.price.toLocaleString("en-IN")}
                        </strong>
                        <span>/ week</span>
                      </div>

                      <Link
                        to="/contact"
                        className="weekly-meal-order-btn"
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

          <p className="weekly-plan-note">
            * Prices are sample prices. Confirm meal inclusions and
            delivery details before ordering.
          </p>
        </div>
      </section>

      <section className="weekly-benefits-section">
        <div className="container">
          <div className="weekly-section-heading text-center">
            <span className="weekly-plan-eyebrow">
              MADE FOR YOUR ROUTINE
            </span>

            <h2>Why Choose a Weekly Plan?</h2>

            <p>
              Enjoy the comfort of homemade food with a simpler
              weekly meal routine.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="weekly-benefit-card">
                <div className="weekly-benefit-icon">
                  <i className="bi bi-calendar-check" />
                </div>

                <h3>Plan Ahead</h3>

                <p>
                  Arrange your meals for the week and simplify
                  your everyday food routine.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="weekly-benefit-card">
                <div className="weekly-benefit-icon">
                  <i className="bi bi-heart" />
                </div>

                <h3>Homemade Comfort</h3>

                <p>
                  Enjoy familiar flavours and freshly prepared
                  meals inspired by home cooking.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="weekly-benefit-card">
                <div className="weekly-benefit-icon">
                  <i className="bi bi-bicycle" />
                </div>

                <h3>Everyday Convenience</h3>

                <p>
                  Spend less time arranging meals and more time
                  focusing on your day.
                </p>
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
                GHARGHUTI JEVAAN, ROJ NAVIN
              </span>

              <h2>Make your week delicious.</h2>

              <p>
                Need help choosing your weekly dabba? Get in touch
                with Aapla Dabba.
              </p>
            </div>

            <Link to="/contact" className="weekly-plan-btn">
              Contact Us
              <i className="bi bi-arrow-up-right ms-2" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default WeeklyPlan;
