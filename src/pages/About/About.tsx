
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./About.css";

function About() {
  const location = useLocation();

  useEffect(() => {
    const sections: Record<string, string> = {
      "/about/our-story": "our-story",
      "/about/why-choose-us": "why-choose-us",
      "/about/our-kitchen": "our-kitchen",
    };

    const sectionId = sections[location.pathname];

    if (sectionId) {
      const timer = window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);

      return () => window.clearTimeout(timer);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-label">WELCOME TO AAPLA DABBA</span>

          <h1>
            The Comfort of Home,
            <span> Served in Every Dabba.</span>
          </h1>

          <p>
            Good food brings comfort, happiness and people together.
            At Aapla Dabba, we bring you fresh, homestyle meals prepared
            with care to make your everyday meals more enjoyable.
          </p>

          <div className="about-buttons">
            <Link to="/about/our-story" className="about-btn-primary">
              Discover Our Story
            </Link>

            <Link to="/menu" className="about-btn-secondary">
              Explore Our Menu
            </Link>
          </div>
        </div>

        <div className="about-hero-image">
          <img src="/images/t3.jpg" alt="Homestyle food" />

          <div className="about-image-caption">
            <span>Made with care</span>
            <h3>Every meal feels like home.</h3>
          </div>
        </div>
      </section>

      <section className="about-story" id="our-story">
        <div className="about-story-image">
          <img src="/images/t4.jpg" alt="Aapla Dabba meal" />
        </div>

        <div className="about-story-content">
          <span className="about-label">OUR STORY</span>

          <h2>Every Dabba Has a Little Taste of Home.</h2>

          <p>
            Aapla Dabba is built around a simple thought: everyone
            deserves a comforting and satisfying meal, even on the
            busiest days.
          </p>

          <p>
            Whether you are working, studying or managing a busy routine,
            we want to make everyday meals easier with food that feels
            familiar, filling and comforting.
          </p>

          <p>
            For us, a good meal is more than just food. It is the warmth,
            care and comfort that make you feel at home.
          </p>

          <Link to="/about/why-choose-us" className="about-text-link">
            Discover Why Choose Us <span>→</span>
          </Link>
        </div>
      </section>

      <section className="about-why" id="why-choose-us">
        <div className="about-heading">
          <span className="about-label">WHY AAPLA DABBA</span>

          <h2>Simple Food. Thoughtful Choices.</h2>

          <p>
            Everyday meals made with care to fit your routine and bring
            comfort to your table.
          </p>
        </div>

        <div className="about-features">
          <article className="about-feature-card">
            <span className="about-feature-number">01</span>
            <h3>Homestyle Taste</h3>
            <p>
              Enjoy familiar flavours and comforting meals inspired by
              everyday home cooking.
            </p>
          </article>

          <article className="about-feature-card">
            <span className="about-feature-number">02</span>
            <h3>Fresh Ingredients</h3>
            <p>
              We focus on fresh ingredients and thoughtful meal preparation
              for your everyday food needs.
            </p>
          </article>

          <article className="about-feature-card">
            <span className="about-feature-number">03</span>
            <h3>Made with Care</h3>
            <p>
              Meals designed around taste, comfort and your everyday routine.
            </p>
          </article>

          <article className="about-feature-card">
            <span className="about-feature-number">04</span>
            <h3>Easy Meal Choices</h3>
            <p>
              Explore meal options that help make your busy days a little
              simpler.
            </p>
          </article>
        </div>
      </section>

      <section className="about-kitchen" id="our-kitchen">
        <div className="about-heading">
          <span className="about-label">OUR FOOD</span>

          <h2>Made for Your Everyday Moments.</h2>

          <p>
            Explore the meals that make Aapla Dabba part of your daily
            routine.
          </p>
        </div>

        <div className="about-gallery">
          <div className="about-gallery-item about-gallery-large">
            <img src="/images/t3.jpg" alt="Freshly prepared food" />
          </div>

          <div className="about-gallery-item">
            <img src="/images/meal.jpg" alt="Homestyle meal" />
          </div>

          <div className="about-gallery-item">
            <img src="/images/meal1.jpg" alt="Everyday food" />
          </div>

          <div className="about-gallery-item">
            <img src="/images/meal2.jpg" alt="Meal ready to serve" />
          </div>

          <div className="about-gallery-item">
            <img src="/images/t7.jpg" alt="Aapla Dabba food" />
          </div>
        </div>
      </section>

      <section className="about-cta">
        <span className="about-label">YOUR NEXT MEAL AWAITS</span>

        <h2>Bring Home the Comfort of Aapla Dabba.</h2>

        <p>
          Make everyday meals easier with food that feels familiar,
          comforting and satisfying.
        </p>

        <Link to="/menu" className="about-btn-primary">
          Explore Our Menu
        </Link>
      </section>
    </main>
  );
}

export default About;
