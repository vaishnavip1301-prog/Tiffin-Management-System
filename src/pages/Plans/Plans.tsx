
import { useNavigate } from "react-router-dom";
import "./Plans.css";

interface MealPlan {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  duration: string;
  image: string;
  features: string[];
  popular: boolean;
  route: string;
}

const mealPlans: MealPlan[] = [
  {
    id: 1,
    name: "Daily Plan",
    subtitle: "Perfect for your everyday meals",
    price: 120,
    duration: "day",
    image: "/images/tiffin2.jpg",
    features: [
      "Fresh home-style food",
      "Daily menu variety",
      "Prepared with quality ingredients",
      "Convenient daily meal option",
    ],
    popular: false,
    route: "/mealplans/dailyplan",
  },
  {
    id: 2,
    name: "Weekly Plan",
    subtitle: "Your weekly meals, sorted",
    price: 700,
    duration: "week",
    image: "/images/tiffin1.jpg",
    features: [
      "Fresh homemade meals",
      "Variety throughout the week",
      "Convenient weekly planning",
      "Great for busy weekdays",
    ],
    popular: true,
    route: "/mealplans/weeklyplan",
  },
  {
    id: 3,
    name: "Monthly Plan",
    subtitle: "Enjoy homemade food every month",
    price: 2800,
    duration: "month",
    image: "/images/tiffin.jpg",
    features: [
      "Regular home-style meals",
      "Menu variety",
      "Convenient monthly planning",
      "A hassle-free meal routine",
    ],
    popular: false,
    route: "/mealplans/monthlyplan",
  },
];

function Plans() {
  const navigate = useNavigate();

  return (
    <main className="plans-page">
      {/* Hero Section */}
      <section className="plans-hero">
        <div className="plans-hero-content">
          <span className="plans-eyebrow">
            HOMEMADE FOOD, MADE SIMPLE
          </span>

          <h1>
            Choose Your
            <br />
            <span>Meal Plan</span>
          </h1>

          <p>
            Enjoy the taste of homemade food every day.
            Choose a meal plan that fits your routine and your needs.
          </p>

          <a href="#available-plans" className="plans-hero-button">
            Explore Meal Plans
            <span aria-hidden="true"> →</span>
          </a>
        </div>
      </section>

      {/* Meal Plans Introduction */}
      <section className="plans-intro" id="available-plans">
        <span className="plans-section-label">
          OUR MEAL PLANS
        </span>

        <h2>Good Food, Your Way</h2>

        <p>
          From a single day to a whole month, find the right plan
          for your everyday meals.
        </p>
      </section>

      {/* Meal Plans Cards */}
      <section className="plans-grid">
        {mealPlans.map((plan) => (
          <article
            className={`plan-card ${
              plan.popular ? "plan-card-popular" : ""
            }`}
            key={plan.id}
          >
            {plan.popular && (
              <span className="plan-popular-label">
                POPULAR CHOICE
              </span>
            )}

            <div className="plan-image-wrapper">
              <img
                src={plan.image}
                alt={plan.name}
                className="plan-image"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div className="plan-card-content">
              <h3>{plan.name}</h3>

              <p className="plan-subtitle">
                {plan.subtitle}
              </p>

              <div className="plan-price">
                <span className="plan-currency">₹</span>

                <strong>
                  {plan.price.toLocaleString("en-IN")}
                </strong>

                <span className="plan-duration">
                  / {plan.duration}
                </span>
              </div>

              <div className="plan-divider" />

              <h4>What's Included</h4>

              <ul className="plan-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <span className="plan-check" aria-hidden="true">
                      ✓
                    </span>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="plan-choose-button"
                onClick={() => navigate(plan.route)}
              >
                Choose Plan
                <span aria-hidden="true"> →</span>
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Bottom Contact Section */}
      <section className="plans-bottom">
        <div className="plans-bottom-content">
          <span className="plans-section-label">
            AAPLA DABBA
          </span>

          <h2>Gharachya Chavicha, Rojcha Dabba</h2>

          <p>
            Bringing the comfort and taste of homemade food
            to your everyday routine.
          </p>
        </div>

        <button
          type="button"
          className="plans-contact-button"
          onClick={() => navigate("/contact")}
        >
          Contact Us
          <span aria-hidden="true"> →</span>
        </button>
      </section>
    </main>
  );
}

export default Plans;
