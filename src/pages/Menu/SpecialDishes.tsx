
import { Link } from "react-router-dom";
import "./SpecialDishes.css";

type SpecialDish = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  tag: string;
};

const specialDishes: SpecialDish[] = [
  {
    id: 1,
    name: "Maharashtrian Thali",
    description:
      "Enjoy a traditional-style meal with chapati, seasonal bhaji, dal, rice and homestyle flavours.",
    price: 160,
    image: "/images/t3.jpg",
    tag: "Local Favourite",
  },
  {
    id: 2,
    name: "Special Veg Thali",
    description:
      "A satisfying combination of fresh vegetables, chapati, rice and delicious everyday accompaniments.",
    price: 180,
    image: "/images/t4.jpg",
    tag: "Customer Favourite",
  },
  {
    id: 3,
    name: "Premium Family Meal",
    description:
      "A generous meal option for sharing with family, featuring a variety of comforting dishes.",
    price: 250,
    image: "/images/t6.jpg",
    tag: "Premium Choice",
  },
];

function SpecialDishes() {
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
            SPECIAL • DELICIOUS • MADE WITH CARE
          </span>

          <h1>
            Discover Our <span>Special Dishes</span>
          </h1>

          <p>
            Make every meal memorable with delicious thalis and special
            homemade food. Discover satisfying flavours prepared with care
            by Aapla Dabba.
          </p>

          <div className="special-dishes-hero-actions">
            <button
              type="button"
              className="special-dishes-primary-btn"
              onClick={exploreDishes}
            >
              Explore Special Dishes
              <i className="bi bi-arrow-down-right"></i>
            </button>

            <Link
              to="/menu"
              className="special-dishes-secondary-btn"
            >
              View Full Menu
            </Link>
          </div>

          <div className="special-dishes-highlights">
            <span>
              <i className="bi bi-egg-fried"></i>
              Delicious Flavours
            </span>
            <span>
              <i className="bi bi-house-heart"></i>
              Homestyle Taste
            </span>
            <span>
              <i className="bi bi-heart"></i>
              Made with Care
            </span>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="special-dishes-intro">
        <div className="container">
          <span className="special-dishes-label">
            SOMETHING SPECIAL FOR YOU
          </span>

          <h2>
            Great Food. <span>Memorable Flavours.</span>
          </h2>

          <p>
            Looking for something beyond your everyday meal? Explore our
            special dishes, comforting thalis and satisfying meal options
            for lunch or dinner.
          </p>
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
                MADE TO SATISFY YOUR CRAVINGS
              </span>

              <h2>Our Special Selection</h2>

              <p>
                Find a delicious meal for your next lunch or dinner.
              </p>
            </div>

            <Link to="/menu" className="special-dishes-view-all">
              View All Meals
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
                      alt={dish.name}
                      className="special-dish-image"
                      loading="lazy"
                    />

                    <span className="special-dish-tag">
                      {dish.tag}
                    </span>
                  </div>

                  <div className="special-dish-card-body">
                    <span className="special-dish-category">
                      SPECIAL DISHES
                    </span>

                    <h3>{dish.name}</h3>

                    <p>{dish.description}</p>

                    <div className="special-dish-card-footer">
                      <div className="special-dish-price-wrap">
                        <span>Starting at</span>
                        <strong>₹{dish.price}</strong>
                        <small>per meal</small>
                      </div>

                      <Link
                        to="/plans"
                        className="special-dish-order-btn"
                        aria-label={`Order ${dish.name}`}
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

          <p className="special-dishes-note">
            <i className="bi bi-info-circle"></i>
            Dish availability and meal contents may vary.
          </p>
        </div>
      </section>

      {/* Why Choose Special Dishes */}
      <section className="special-dishes-benefits">
        <div className="container">
          <div className="special-dishes-benefits-heading">
            <span className="special-dishes-label">
              THE AAPLA DABBA EXPERIENCE
            </span>

            <h2>Make Your Meals More Special</h2>

            <p>
              Enjoy satisfying food choices for days when you want
              something extra delicious.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-sm-6 col-lg-3">
              <article className="special-dish-benefit-card">
                <i className="bi bi-egg-fried"></i>
                <h3>Delicious Variety</h3>
                <p>
                  Explore different meal combinations and familiar flavours.
                </p>
              </article>
            </div>

            <div className="col-sm-6 col-lg-3">
              <article className="special-dish-benefit-card">
                <i className="bi bi-house-heart"></i>
                <h3>Homestyle Food</h3>
                <p>
                  Enjoy comforting dishes inspired by home-cooked meals.
                </p>
              </article>
            </div>

            <div className="col-sm-6 col-lg-3">
              <article className="special-dish-benefit-card">
                <i className="bi bi-people"></i>
                <h3>Sharing Options</h3>
                <p>
                  Choose suitable meal options for yourself or your family.
                </p>
              </article>
            </div>

            <div className="col-sm-6 col-lg-3">
              <article className="special-dish-benefit-card">
                <i className="bi bi-heart"></i>
                <h3>Made with Care</h3>
                <p>
                  Discover meals selected to make everyday dining enjoyable.
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
                YOUR NEXT FAVOURITE MEAL
              </span>

              <h2>Bring Something Special to Your Table.</h2>

              <p>
                Explore the complete Aapla Dabba menu and find your favourite.
              </p>
            </div>

            <Link to="/menu" className="special-dishes-cta-btn">
              Explore Our Menu
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SpecialDishes;
