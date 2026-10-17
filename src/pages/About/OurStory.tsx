
import { Link } from "react-router-dom";
import "./OurStory.css";

function OurStory() {
  return (
    <main className="our-story-page">
      {/* Hero Section */}
      <section className="our-story-hero">
        <div className="our-story-overlay"></div>

        <div className="container our-story-hero-content">
          <span className="our-story-kicker">
            THE STORY BEHIND AAPLA DABBA
          </span>

          <h1>
            Good Food,
            <br />
            <span>Made with Love.</span>
          </h1>

          <p>
            Every meal has a story. Ours began with a simple idea:
            bringing the comfort, taste and warmth of homemade food
            to your everyday life.
          </p>

          <div className="our-story-buttons">
            <Link to="/menu" className="our-story-primary-btn">
              Explore Our Menu
            </Link>

            <Link to="/about" className="our-story-secondary-btn">
              About Us
            </Link>
          </div>

          <div className="our-story-highlights">
            <span>
              <i className="bi bi-heart-fill"></i>
              Made with Care
            </span>
            <span>
              <i className="bi bi-house-heart-fill"></i>
              Homemade Taste
            </span>
            <span>
              <i className="bi bi-egg-fried"></i>
              Fresh Meals
            </span>
          </div>
        </div>
      </section>

      {/* Our Beginning */}
      <section className="our-story-beginning">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="our-story-image-wrap">
                <img
                  src="/images/t4.jpg"
                  alt="Freshly prepared homemade food"
                  className="our-story-image"
                />

                <div className="our-story-image-caption">
                  <i className="bi bi-heart-fill"></i>
                  <div>
                    <strong>Food That Feels Like Home</strong>
                    <span>Comfort in every bite</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <span className="our-story-section-label">
                HOW IT BEGAN
              </span>

              <h2>
                A Simple Idea,
                <br />
                <span>A Meaningful Journey.</span>
              </h2>

              <p>
                Aapla Dabba is built around the idea that everyday
                food should be fresh, satisfying and comforting.
                We want to make it easier for people to enjoy
                homemade-style meals even when their busy schedules
                keep them away from home.
              </p>

              <p>
                From the familiar taste of everyday meals to the
                comfort of a well-prepared tiffin, our goal is to
                bring warmth and convenience to your dining
                experience.
              </p>

              <Link to="/menu" className="our-story-text-link">
                Discover Our Meals
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Purpose */}
      <section className="our-story-purpose">
        <div className="container">
          <div className="our-story-heading">
            <span className="our-story-section-label">
              WHAT DRIVES US
            </span>

            <h2>
              More Than Just
              <span> a Meal.</span>
            </h2>

            <p>
              We believe good food should make your everyday life
              simpler, happier and more satisfying.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <article className="our-story-value-card">
                <div className="our-story-value-icon">
                  <i className="bi bi-heart"></i>
                </div>

                <h3>Our Mission</h3>

                <p>
                  To make everyday meals convenient and enjoyable
                  by offering food inspired by the comfort of home.
                </p>
              </article>
            </div>

            <div className="col-md-4">
              <article className="our-story-value-card">
                <div className="our-story-value-icon">
                  <i className="bi bi-stars"></i>
                </div>

                <h3>Our Promise</h3>

                <p>
                  To focus on freshness, thoughtful preparation
                  and a satisfying food experience with every meal.
                </p>
              </article>
            </div>

            <div className="col-md-4">
              <article className="our-story-value-card">
                <div className="our-story-value-icon">
                  <i className="bi bi-house-heart"></i>
                </div>

                <h3>Our Belief</h3>

                <p>
                  Good food brings comfort, creates connections
                  and makes an ordinary day feel a little better.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="our-story-cta">
        <div className="container">
          <div className="our-story-cta-inner">
            <div>
              <span className="our-story-section-label">
                YOUR NEXT MEAL STARTS HERE
              </span>

              <h2>Bring Home the Taste of Comfort.</h2>

              <p>
                Explore our meals and find something delicious
                for your everyday routine.
              </p>
            </div>

            <Link to="/menu" className="our-story-cta-btn">
              Explore Menu
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default OurStory;
