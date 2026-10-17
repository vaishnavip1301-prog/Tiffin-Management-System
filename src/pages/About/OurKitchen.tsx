
import { Link } from "react-router-dom";
import "./OurKitchen.css";

const kitchenImages = [
  {
    image: "/images/t3.jpg",
    title: "Food That Feels Like Home",
    description: "Comforting meals for everyday moments.",
  },
  {
    image: "/images/t4.jpg",
    title: "Everyday Meal Inspiration",
    description: "The familiar joy of homemade-style food.",
  },
  {
    image: "/images/t5.jpg",
    title: "A Love for Good Food",
    description: "Making everyday meals worth looking forward to.",
  },
  {
    image: "/images/t6.jpg",
    title: "Simple Food Moments",
    description: "Food that brings comfort to your routine.",
  },
  {
    image: "/images/t7.jpg",
    title: "Meals for Your Day",
    description: "Explore the food behind Aapla Dabba.",
  },
];

function OurKitchen() {
  return (
    <main className="our-kitchen-page">
      <section className="our-kitchen-hero">
        <div className="container">
          <span className="our-kitchen-label">A LOOK BEHIND THE MEALS</span>

          <h1>
            Welcome to
            <br />
            <span>Our Kitchen.</span>
          </h1>

          <p>
            Every meal begins with an idea, thoughtful preparation
            and a love for food that feels familiar.
          </p>

          <Link to="/menu" className="our-kitchen-btn">
            Explore Our Menu <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>

      <section className="our-kitchen-intro">
        <div className="container">
          <div className="our-kitchen-heading">
            <span className="our-kitchen-label">BEHIND AAPLA DABBA</span>

            <h2>
              The Food, The Feeling,
              <span> The Everyday Comfort.</span>
            </h2>

            <p>
              Our kitchen story is about the role food plays in
              everyday life. We want every meal to feel approachable,
              comforting and worth looking forward to.
            </p>
          </div>

          <div className="our-kitchen-gallery">
            {kitchenImages.map((item, index) => (
              <article
                className={`our-kitchen-card our-kitchen-card-${index + 1}`}
                key={item.image}
              >
                <img src={item.image} alt={item.title} />

                <div className="our-kitchen-card-caption">
                  <span>0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="our-kitchen-values">
        <div className="container">
          <div className="our-kitchen-values-inner">
            <div>
              <span className="our-kitchen-label">OUR APPROACH</span>
              <h2>Good Food Starts with Care.</h2>
            </div>

            <p>
              We believe in thoughtful food preparation, a welcoming
              meal experience and making everyday dining more convenient.
              Explore our menu to see the options available to you.
            </p>
          </div>
        </div>
      </section>

      <section className="our-kitchen-cta">
        <div className="container our-kitchen-cta-inner">
          <div>
            <span className="our-kitchen-label">SOMETHING DELICIOUS AWAITS</span>
            <h2>Make Your Next Meal Special.</h2>
            <p>Find a meal to suit your everyday routine.</p>
          </div>

          <Link to="/menu" className="our-kitchen-btn">
            View Our Menu <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default OurKitchen;
