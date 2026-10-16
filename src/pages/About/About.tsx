
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./About.css";

const images = [
  "/images/t3.jpg",
  "/images/t4.jpg",
  "/images/t5.jpg",
  "/images/t6.jpg",
];

export default function About() {
  const location = useLocation();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % images.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const timer = window.setTimeout(() => {
      document
        .getElementById(location.hash.slice(1))
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  const previousSlide = () => {
    setActiveSlide((current) =>
      (current - 1 + images.length) % images.length
    );
  };

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % images.length);
  };

  return (
    <main className="about-page">
      {/* About Hero */}
      <section className="about-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="about-label">ABOUT AAPLA DABBA</span>

              <h1>
                The Comfort of Home,
                <span> Served in Every Dabba.</span>
              </h1>

              <p>
                Aapla Dabba brings the comfort of homemade food into your
                everyday life. We aim to make your daily meals convenient,
                satisfying, and full of familiar flavours.
              </p>

              <a href="#our-story" className="about-button">
                Discover Our Story
              </a>
            </div>

            <div className="col-lg-6">
              <div className="about-hero-image">
                <img
                  src="/images/t7.jpg"
                  alt="Homemade food from Aapla Dabba"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Our Story */}
      <section className="about-story" id="our-story">
        <div className="container">
          <div className="about-content">
            <span className="about-label">OUR STORY</span>

            <h2>
              Food That Feels
              <span> Like Home</span>
            </h2>

            <p>
              Everyday life can get busy, leaving little time to prepare
              meals. Aapla Dabba aims to make everyday food more convenient
              while keeping the comfort of homemade meals at heart.
            </p>

            <p>
              We want students, working professionals, and families to have
              a convenient food option that fits into their daily routine.
              Our focus is on care, quality, and a satisfying meal experience.
            </p>

            <div className="about-mission">
              <h3>Our Mission</h3>
              <p>
                To make everyday meals easier and bring the warmth of
                homemade food closer to our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Food Image Slider */}
      <section className="about-gallery">
        <div className="container">
          <div className="about-heading">
            <span className="about-label">A TASTE OF HOME</span>
            <h2>Fresh Food, <span>Every Day</span></h2>
            <p>Explore the meals and flavours of Aapla Dabba.</p>
          </div>

          <div className="about-slider">
            <div className="about-slider-image">
              <img
                src={images[activeSlide]}
                alt={`Aapla Dabba food ${activeSlide + 1}`}
              />
            </div>

            <button
              type="button"
              className="about-arrow about-prev"
              onClick={previousSlide}
              aria-label="Previous image"
            >
              &#10094;
            </button>

            <button
              type="button"
              className="about-arrow about-next"
              onClick={nextSlide}
              aria-label="Next image"
            >
              &#10095;
            </button>

            <div className="about-dots">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={activeSlide === index ? "active" : ""}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Why Choose Us */}
      <section className="about-why" id="why-choose-us">
        <div className="container">
          <div className="about-heading">
            <span className="about-label">WHY AAPLA DABBA</span>
            <h2>Why Choose <span>Us?</span></h2>
            <p>Everyday meals with care, comfort, and convenience.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="about-card">
                <i className="bi bi-heart"></i>
                <h3>Homemade Taste</h3>
                <p>
                  Enjoy familiar flavours inspired by the comfort of home
                  cooking.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="about-card">
                <i className="bi bi-egg-fried"></i>
                <h3>Fresh Meals</h3>
                <p>
                  We focus on thoughtful preparation and quality ingredients.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="about-card">
                <i className="bi bi-shield-check"></i>
                <h3>Clean Preparation</h3>
                <p>
                  Cleanliness and care are important parts of food preparation.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="about-card">
                <i className="bi bi-clock"></i>
                <h3>Everyday Convenience</h3>
                <p>
                  Make your daily meal routine simpler with convenient
                  tiffin options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="about-founder">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-5">
              <div className="about-founder-image">
                <img
                  src="/images/founder.jpg"
                  alt="Aapla Dabba founder"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="col-md-7">
              <span className="about-label">OUR FOUNDER</span>

              <h2>
                The Vision Behind
                <span> Aapla Dabba</span>
              </h2>

              <p>
                Aapla Dabba is built around the idea that everyday food
                should be convenient and comforting. Our vision is to make
                the daily meal experience easier while keeping care and
                customer satisfaction at the centre.
              </p>

              <p>
                We believe a good meal is more than food. It is a small
                moment of comfort in a busy day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Our Kitchen */}
      <section className="about-kitchen" id="our-kitchen">
        <div className="container">
          <div className="about-content">
            <span className="about-label">OUR KITCHEN</span>

            <h2>
              Prepared with Care,
              <span> Served with Love</span>
            </h2>

            <p>
              Our approach begins with careful food preparation and a focus
              on quality. We aim to make every meal a satisfying part of
              your everyday routine.
            </p>

            <p>
              From the kitchen to your table, Aapla Dabba is here to make
              enjoying everyday meals more convenient.
            </p>

            <Link to="/menu" className="about-button">
              Explore Our Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="about-cta">
        <div className="container">
          <h2>Your Everyday Meal, Made Simpler.</h2>
          <p>Discover the food options available at Aapla Dabba.</p>
          <Link to="/menu" className="about-button about-button-light">
            View Menu
          </Link>
        </div>
      </section>
    </main>
  );
}
