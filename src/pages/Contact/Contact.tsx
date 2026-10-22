
import { useState, type FormEvent } from "react";
import "./Contact.css";

const faqs = [
  {
    question: "Can I order a daily tiffin?",
    answer:
      "Submit an enquiry for daily tiffin and discuss meal availability and timings with us.",
  },
  {
    question: "Are weekly and monthly plans available?",
    answer:
      "Select your preferred weekly or monthly plan in the enquiry form.",
  },
  {
    question: "Which areas do you serve?",
    answer:
      "Our listed location is Hadapsar, Pune, Maharashtra – 411013. Contact us to enquire about delivery availability in your area.",
  },
  {
    question: "Can I request special meal preferences?",
    answer:
      "Yes. Mention your food preferences, meal quantity and timings in the additional requirements field.",
  },
  {
    question: "How can I enquire about pricing?",
    answer:
      "Submit the enquiry form with your preferred plan to discuss pricing and availability.",
  },
];

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
  <div className="container">
    <div className="contact-hero-layout">
      <div className="contact-hero-content">
        <span className="contact-eyebrow">
          <i className="bi bi-egg-fried"></i> AAPLA DABBA
        </span>

        <h1>
          Gharachya Chavicha,
          <span> Rojcha Dabba!</span>
        </h1>

        <p>
          Enjoy the comfort of homemade meals with Aapla Dabba.
          Enquire about our tiffin plans and find an option that
          suits your everyday routine.
        </p>

        <a href="#tiffin-enquiry" className="contact-primary-btn">
          Enquire About Tiffin
          <i className="bi bi-arrow-right"></i>
        </a>
      </div>

      <div className="contact-hero-image">
        <img
          src="/images/tiffin2.jpg"
          alt="Aapla Dabba homemade food"
        />
      </div>
    </div>
  </div>
</section>

      <section className="contact-info-section">
        <div className="container">
          <div className="contact-section-heading">
            <span className="contact-eyebrow">GET IN TOUCH</span>
            <h2>Let's Talk About Your Dabba</h2>
            <p>
              Have a question about meals or tiffin plans?
              Share your requirements with us.
            </p>
          </div>

          <div className="contact-info-grid">
            <article className="contact-info-card">
              <div className="contact-info-icon">
                <i className="bi bi-geo-alt"></i>
              </div>
              <h3>Our Location</h3>
              <p>Hadapsar, Pune, Maharashtra – 411013</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Hadapsar%2C%20Pune%2C%20Maharashtra%20411013"
                target="_blank"
                rel="noreferrer"
                className="contact-card-link"
              >
                Get Directions <i className="bi bi-arrow-up-right"></i>
              </a>
            </article>

            <article className="contact-info-card">
              <div className="contact-info-icon">
                <i className="bi bi-calendar2-check"></i>
              </div>
              <h3>Tiffin Plans</h3>
              <p>
                Enquire about daily, weekly and monthly meal plans.
              </p>
              <a href="#tiffin-enquiry" className="contact-card-link">
                Explore Plans <i className="bi bi-arrow-right"></i>
              </a>
            </article>

            <article className="contact-info-card">
              <div className="contact-info-icon">
                <i className="bi bi-chat-dots"></i>
              </div>
              <h3>Meal Enquiry</h3>
              <p>
                Tell us about your food preferences and delivery requirements.
              </p>
              <a href="#tiffin-enquiry" className="contact-card-link">
                Send Enquiry <i className="bi bi-arrow-right"></i>
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="contact-form-section" id="tiffin-enquiry">
        <div className="container">
          <div className="contact-form-layout">
            <div className="contact-form-info">
              <span className="contact-eyebrow">
                YOUR DABBA STARTS HERE
              </span>

              <h2>Tell Us What You'd Like to Eat!</h2>

              <p>
                Fill in your details and preferred plan. Add your
                delivery area and any special meal requirements.
              </p>

              <div className="contact-promise-list">
                <div className="contact-promise-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Homestyle meal enquiries</span>
                </div>

                <div className="contact-promise-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Daily, weekly and monthly plans</span>
                </div>

                <div className="contact-promise-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Food preferences and delivery enquiries</span>
                </div>
              </div>

              <div className="contact-location-note">
                <i className="bi bi-geo-alt-fill"></i>
                <div>
                  <strong>Our Location</strong>
                  <p>Hadapsar, Pune, Maharashtra – 411013</p>
                </div>
              </div>
            </div>

            <div className="contact-form-card">
              <div className="contact-form-heading">
                <h3>Tiffin Enquiry Form</h3>
                <p>Fields marked with * are required.</p>
              </div>

              {submitted && (
                <div className="contact-success-message" role="status">
                  <i className="bi bi-check-circle-fill"></i>
                  Demo submission successful. Connect a backend to save
                  enquiries permanently.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="customerName">Full Name *</label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="customerPhone">Mobile Number *</label>
                    <input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      placeholder="Enter your mobile number"
                      autoComplete="tel"
                      pattern="[0-9+\-\s()]{10,15}"
                      title="Enter a valid phone number."
                      required
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="customerEmail">Email Address</label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                </div>

                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="tiffinPlan">Preferred Plan *</label>
                    <select
                      id="tiffinPlan"
                      name="tiffinPlan"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Select a plan
                      </option>
                      <option value="Daily Tiffin">Daily Tiffin</option>
                      <option value="Weekly Plan">Weekly Plan</option>
                      <option value="Monthly Plan">Monthly Plan</option>
                      <option value="Custom Enquiry">Other Enquiry</option>
                    </select>
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="mealPreference">Meal Preference *</label>
                    <select
                      id="mealPreference"
                      name="mealPreference"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Select preference
                      </option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Special Meal Enquiry">
                        Special Meal Enquiry
                      </option>
                      <option value="Other Requirements">
                        Other Requirements
                      </option>
                    </select>
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="deliveryAddress">
                    Delivery Area / Address *
                  </label>
                  <input
                    type="text"
                    id="deliveryAddress"
                    name="deliveryAddress"
                    placeholder="Enter your delivery area or address"
                    autoComplete="street-address"
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="additionalRequirements">
                    Additional Requirements
                  </label>
                  <textarea
                    id="additionalRequirements"
                    name="additionalRequirements"
                    rows={4}
                    placeholder="Meal timing, quantity or other requirements..."
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn">
                  Submit Tiffin Enquiry
                  <i className="bi bi-arrow-right"></i>
                </button>

                <p className="contact-form-disclaimer">
                  This form is currently a frontend demo and does not
                  save submissions to a database.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-benefits-section">
        <div className="container">
          <div className="contact-section-heading">
            <span className="contact-eyebrow">WHY AAPLA DABBA?</span>
            <h2>Your Everyday Meal, Made Simple</h2>
            <p>
              Tell us what works best for your everyday food routine.
            </p>
          </div>

          <div className="contact-benefits-grid">
            <article className="contact-benefit-card">
              <i className="bi bi-house-heart"></i>
              <h3>Homestyle Taste</h3>
              <p>
                Enquire about everyday meals inspired by home-cooked food.
              </p>
            </article>

            <article className="contact-benefit-card">
              <i className="bi bi-calendar-week"></i>
              <h3>Flexible Plans</h3>
              <p>
                Explore daily, weekly and monthly plans for your routine.
              </p>
            </article>

            <article className="contact-benefit-card">
              <i className="bi bi-bicycle"></i>
              <h3>Delivery Enquiry</h3>
              <p>
                Share your area to enquire about delivery availability.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="contact-faq-section">
        <div className="container">
          <div className="contact-section-heading">
            <span className="contact-eyebrow">GOT QUESTIONS?</span>
            <h2>Frequently Asked Questions</h2>
            <p>Answers to common questions about our tiffin service.</p>
          </div>

          <div className="contact-faq-list">
            {faqs.map((faq) => (
              <details className="contact-faq-item" key={faq.question}>
                <summary>
                  <span>{faq.question}</span>
                  <i className="bi bi-plus-lg"></i>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-map-section">
        <div className="container">
          <div className="contact-map-heading">
            <div>
              <span className="contact-eyebrow">FIND OUR LOCATION</span>
              <h2>Serving From Hadapsar, Pune</h2>
              <p>Hadapsar, Pune, Maharashtra – 411013</p>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Hadapsar%2C%20Pune%2C%20Maharashtra%20411013"
              target="_blank"
              rel="noreferrer"
              className="contact-map-link"
            >
              Open Google Maps
              <i className="bi bi-arrow-up-right"></i>
            </a>
          </div>

          <div className="contact-map-frame">
            <iframe
              title="Map showing Hadapsar, Pune"
              src="https://www.google.com/maps?q=Hadapsar%2C%20Pune%2C%20Maharashtra%20411013&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
