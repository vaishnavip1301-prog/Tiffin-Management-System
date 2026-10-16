
import { Link } from "react-router-dom";
import "./Home.css";

const mealPlans = [
  {
    name: "Daily Plan",
    description: "Fresh homemade meals for every day.",
    price: "₹120",
    period: "/ day",
    image:
      "/images/tiffin2.jpg",
    icon: "bi-sun",
    tag: "Flexible",
  },
  {
    name: "Weekly Plan",
    description: "Your favourite meals, all week long.",
    price: "₹700",
    period: "/ week",
    image:
      "images/tiffin1.jpg",
    icon: "bi-calendar-week",
    tag: "Popular",
  },
  {
    name: "Monthly Plan",
    description: "Homemade goodness throughout the month.",
    price: "₹2,800",
    period: "/ month",
    image:
      "images/tiffin.jpg",
    icon: "bi-calendar-heart",
    tag: "Best Value",
  },
];

const benefits = [
  {
    icon: "bi-leaf",
    title: "Fresh Ingredients",
    description: "Freshness in every bite",
  },
  {
    icon: "bi-heart",
    title: "Homemade Taste",
    description: "Comfort food, just like home",
  },
  {
    icon: "bi-shield-check",
    title: "Clean & Hygienic",
    description: "Care in every preparation",
  },
  {
    icon: "bi-truck",
    title: "Doorstep Delivery",
    description: "Meals delivered to you",
  },
];

const specialDishes = [
  {
    name: "Veg Thali",
    description: "Dal, sabzi, roti & rice",
    price: "₹120",
    image:
      "images/vegthali.jpg",
  },
  {
    name: "Healthy Bowl",
    description: "Fresh and wholesome",
    price: "₹100",
    image:
      "images/HealthyBowl.jpg",
  },
  {
    name: "Indian Special",
    description: "Traditional flavours",
    price: "₹150",
    image:
      "images/IndianSpecial.jpg",
  },
];

function Home() {
  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 hero-copy">
              <div className="hero-label">
                <i className="bi bi-leaf-fill"></i>
                Fresh <span>•</span> Homemade <span>•</span> Healthy
              </div>

              <h1>
                Gharachya chavicha,
                <span> rojcha dabba.</span>
              </h1>

              <p className="hero-description">
                Enjoy fresh, delicious and wholesome homemade meals
                delivered to your doorstep. Because good food makes
                every day better.
              </p>

              <div className="hero-actions">
                <Link to="/menu" className="btn home-primary-btn">
                  Explore Our Menu
                  <i className="bi bi-arrow-right"></i>
                </Link>

                <Link to="/plans" className="btn home-outline-btn">
                  <i className="bi bi-calendar-check"></i>
                  View Meal Plans
                </Link>
              </div>

              <div className="hero-note">
                <span className="hero-note-icon">
                  <i className="bi bi-heart-fill"></i>
                </span>
                <span>
                  <strong>Made with care</strong>
                  <small>Served with a homely touch</small>
                </span>
              </div>
            </div>

            <div className="col-lg-6 hero-visual">
              <div className="hero-image-frame">
                <img
                  src="images/tiffin4.jpg"
                  alt="A delicious Indian meal"
                  className="hero-food-image"
                />

                <div className="hero-image-badge">
                  <i className="bi bi-stars"></i>
                  <span>
                    <strong>Homemade</strong>
                    <small>With love</small>
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
              <div
                className="col-6 col-lg-3"
                key={benefit.title}
                style={undefined}
              >
                <div
                  className="benefit-item"
                  data-delay={index}
                >
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
          <source
            src="/videos/video.mp4"
            type="video/mp4"
          />
          Your browser does not support HTML video.
        </video>
      </section>


      {/* MEAL PLANS */}
      <section className="home-plans section-padding">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                <i className="bi bi-flower1"></i> OUR MEAL PLANS
              </span>

              <h2>
                Good food for
                <span> every routine.</span>
              </h2>

              <p>
                Choose a plan that fits your lifestyle and enjoy
                the comfort of homemade meals.
              </p>
            </div>

            <Link to="/plans" className="section-link">
              Explore All Plans
              <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {mealPlans.map((plan, index) => (
              <div className="col-md-6 col-lg-4" key={plan.name}>
                <article
                  className="meal-plan-card"
                  data-delay={index}
                >
                  <div className="meal-plan-image-wrap">
                    <img src={plan.image} alt={plan.name} />

                    <span className="meal-plan-tag">
                      {plan.tag}
                    </span>
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
                        to="/plans"
                        className="meal-plan-order"
                        aria-label={`Explore ${plan.name}`}
                      >
                        Explore <i className="bi bi-arrow-right"></i>
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
              <i className="bi bi-fire"></i> FRESHLY PREPARED
            </span>

            <h2>Today's Special</h2>

            <p>A little taste of home, made fresh for you.</p>
          </div>

          <div className="row g-4">
            {specialDishes.map((dish, index) => (
              <div className="col-md-6 col-lg-4" key={dish.name}>
                <article
                  className="special-card"
                  data-delay={index}
                >
                  <img src={dish.image} alt={dish.name} />

                  <div className="special-card-content">
                    <h3>{dish.name}</h3>
                    <p>{dish.description}</p>

                    <div className="special-card-bottom">
                      <strong>{dish.price}</strong>
                      <Link to="/menu" aria-label={`View ${dish.name}`}>
                        View Menu <i className="bi bi-arrow-right"></i>
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
              <span>Your everyday meal, sorted.</span>
              <h2>Ready for a gharachya chavicha dabba?</h2>
              <p>
                Explore our menu and find a meal plan that works for you.
              </p>
            </div>

            <Link to="/contact" className="btn home-cta-btn">
              Get in Touch <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
