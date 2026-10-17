
import { Link } from "react-router-dom";
import "./WhyChooseUs.css";

function WhyChooseUs() {
  return (
    <main className="why-choose-page">
      <section className="why-choose-hero">
        <div className="container">
          <span className="why-choose-label">THE AAPLA DABBA DIFFERENCE</span>

          <h1>
            Everyday Meals,
            <br />
            <span>Made Easier.</span>
          </h1>

          <p>
            Good food should fit your everyday life. Discover the
            values behind our approach to convenient, comforting meals.
          </p>

          <Link to="/menu" className="why-choose-btn">
            Explore Our Menu <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>

      <section className="why-choose-content">
        <div className="container">
          <div className="why-choose-heading">
            <span className="why-choose-label">WHY AAPLA DABBA?</span>
            <h2>Food That Fits Your <span>Everyday Life.</span></h2>
            <p>
              We want ordering your everyday meals to feel simple,
              convenient and satisfying.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <article className="why-choose-card">
                <div className="why-choose-icon">
                  <i className="bi bi-house-heart"></i>
                </div>
                <h3>Homemade-Style Comfort</h3>
                <p>
                  Enjoy meals inspired by the familiar flavours and
                  comfort of food prepared at home.
                </p>
              </article>
            </div>

            <div className="col-md-6 col-lg-4">
              <article className="why-choose-card">
                <div className="why-choose-icon">
                  <i className="bi bi-clock"></i>
                </div>
                <h3>Everyday Convenience</h3>
                <p>
                  Make your daily meal planning easier with food
                  options designed for busy routines.
                </p>
              </article>
            </div>

            <div className="col-md-6 col-lg-4">
              <article className="why-choose-card">
                <div className="why-choose-icon">
                  <i className="bi bi-egg-fried"></i>
                </div>
                <h3>Food for Every Day</h3>
                <p>
                  Explore meal options that can make your everyday
                  dining routine more enjoyable.
                </p>
              </article>
            </div>

            <div className="col-md-6 col-lg-4">
              <article className="why-choose-card">
                <div className="why-choose-icon">
                  <i className="bi bi-heart"></i>
                </div>
                <h3>Prepared with Care</h3>
                <p>
                  We value thoughtful preparation and a positive
                  experience with every meal you choose.
                </p>
              </article>
            </div>

            <div className="col-md-6 col-lg-4">
              <article className="why-choose-card">
                <div className="why-choose-icon">
                  <i className="bi bi-list-check"></i>
                </div>
                <h3>Easy Meal Choices</h3>
                <p>
                  Browse our menu to find meal categories that suit
                  your preferences and daily needs.
                </p>
              </article>
            </div>

            <div className="col-md-6 col-lg-4">
              <article className="why-choose-card">
                <div className="why-choose-icon">
                  <i className="bi bi-people"></i>
                </div>
                <h3>Made for Everyday Living</h3>
                <p>
                  Our idea is simple: make everyday food more
                  approachable for people with busy schedules.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="why-choose-cta">
        <div className="container why-choose-cta-inner">
          <div>
            <span className="why-choose-label">READY TO EXPLORE?</span>
            <h2>Your Next Favourite Meal Awaits.</h2>
            <p>Take a look at our menu and discover your options.</p>
          </div>

          <Link to="/menu" className="why-choose-btn">
            View Menu <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default WhyChooseUs;
