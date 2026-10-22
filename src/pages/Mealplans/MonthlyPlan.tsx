
import { Link } from "react-router-dom";
import "./MonthlyPlan.css";

const monthlyMeals = [
  {
    id: 1,
    name: "Monthly Veg Dabba",
    description:
      "Enjoy fresh chapati, seasonal bhaji, dal and rice with homemade flavours throughout the month.",
    price: 2800,
    image: "/images/tiffin.jpg",
    tag: "Most Popular",
  },
  {
    id: 2,
    name: "Monthly Special Thali",
    description:
      "A satisfying combination of fresh vegetables, soft rotis, dal and rice for your everyday meals.",
    price: 3200,
    image: "/images/vegthali.jpg",
    tag: "Homemade Favourite",
  },
  {
    id: 3,
    name: "Monthly Healthy Meals",
    description:
      "Wholesome meals made with fresh ingredients for your busy everyday routine.",
    price: 3000,
    image: "/images/tiffin2.jpg",
    tag: "Healthy Choice",
  },
];

function MonthlyPlan() {
  return (
    <main className="monthly-plan-page">
      <section className="monthly-plan-hero">
        <div className="container">
          <div className="monthly-plan-hero-content">
            <span className="monthly-plan-eyebrow">
              YOUR MONTHLY MEAL SOLUTION
            </span>

            <h1>
              One Month,
              <br />
              <span>Countless Homemade Moments.</span>
            </h1>

            <p>
              Your favourite gharghuti jevaan, ready for your everyday routine.
              Choose a monthly meal plan and enjoy homemade food with greater
              convenience.
            </p>

            <a href="#monthly-meals" className="monthly-plan-btn">
              Explore Monthly Plans
              <i className="bi bi-arrow-down-right ms-2" />
            </a>

            <div className="monthly-plan-highlights">
              <span>
                <i className="bi bi-check-circle-fill" />
                Freshly Prepared
              </span>

              <span>
                <i className="bi bi-check-circle-fill" />
                Monthly Convenience
              </span>

              <span>
                <i className="bi bi-check-circle-fill" />
                Homemade Taste
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="monthly-meals-section" id="monthly-meals">
        <div className="container">
          <div className="monthly-section-heading text-center">
            <span className="monthly-plan-eyebrow">
              GOOD FOOD, EVERY DAY
            </span>

            <h2>Choose Your Monthly Dabba</h2>

            <p>
              Make everyday meals simple with fresh, flavourful and
              homestyle food from Aapla Dabba.
            </p>
          </div>

          <div className="row g-4">
            {monthlyMeals.map((meal) => (
              <div className="col-12 col-md-6 col-lg-4" key={meal.id}>
                <article className="monthly-meal-card">
                  <div className="monthly-meal-image-wrap">
                    <img src={meal.image} alt={meal.name} />

                    <span className="monthly-meal-tag">
                      {meal.tag}
                    </span>
                  </div>

                  <div className="monthly-meal-content">
                    <h3>{meal.name}</h3>

                    <p>{meal.description}</p>

                    <div className="monthly-meal-bottom">
                      <div className="monthly-meal-price">
                        <strong>
                          ₹{meal.price.toLocaleString("en-IN")}
                        </strong>
                        <span>/ month</span>
                      </div>

                      <Link
                        to="/contact"
                        className="monthly-meal-order-btn"
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

          <p className="monthly-plan-note">
            * Prices are sample prices. Confirm meal inclusions,
            subscription duration and delivery details before ordering.
          </p>
        </div>
      </section>

      <section className="monthly-benefits-section">
        <div className="container">
          <div className="monthly-section-heading text-center">
            <span className="monthly-plan-eyebrow">
              A BETTER EVERYDAY ROUTINE
            </span>

            <h2>Why Choose a Monthly Plan?</h2>

            <p>
              Enjoy the comfort of homemade meals while keeping your
              monthly food routine organised.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="monthly-benefit-card">
                <div className="monthly-benefit-icon">
                  <i className="bi bi-calendar2-check" />
                </div>

                <h3>Easy Meal Planning</h3>

                <p>
                  Plan your regular meals ahead and simplify your busy
                  everyday schedule.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="monthly-benefit-card">
                <div className="monthly-benefit-icon">
                  <i className="bi bi-heart" />
                </div>

                <h3>Homemade Goodness</h3>

                <p>
                  Enjoy familiar flavours and comforting meals inspired
                  by home cooking.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="monthly-benefit-card">
                <div className="monthly-benefit-icon">
                  <i className="bi bi-clock-history" />
                </div>

                <h3>Everyday Convenience</h3>

                <p>
                  Spend less time worrying about daily meals and more time
                  doing what matters to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="monthly-plan-cta">
        <div className="container">
          <div className="monthly-plan-cta-content">
            <div>
              <span className="monthly-plan-eyebrow">
                GHARGHUTI JEVAAN, ROJ NAVIN
              </span>

              <h2>Your monthly meals, made simple.</h2>

              <p>
                Ready to enjoy homemade food every day? Contact Aapla Dabba
                to discuss your monthly plan.
              </p>
            </div>

            <Link to="/contact" className="monthly-plan-btn">
              Contact Us
              <i className="bi bi-arrow-up-right ms-2" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MonthlyPlan;
