
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import "./Contact.css";

const faqKeys = ["daily", "plans", "areas", "preferences", "pricing"];

function Contact() {
  const { t } = useTranslation();
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
                {t("contact.hero.titleLine1")}
                <span> {t("contact.hero.titleLine2")}</span>
              </h1>

              <p>{t("contact.hero.description")}</p>

              <a href="#tiffin-enquiry" className="contact-primary-btn">
                {t("contact.hero.button")}
                <i className="bi bi-arrow-right"></i>
              </a>
            </div>

            <div className="contact-hero-image">
              <img
                src="/images/tiffin2.jpg"
                alt={t("contact.hero.imageAlt")}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="contact-info-section">
        <div className="container">
          <div className="contact-section-heading">
            <span className="contact-eyebrow">
              {t("contact.info.eyebrow")}
            </span>
            <h2>{t("contact.info.title")}</h2>
            <p>{t("contact.info.description")}</p>
          </div>

          <div className="contact-info-grid">
            <article className="contact-info-card">
              <div className="contact-info-icon">
                <i className="bi bi-geo-alt"></i>
              </div>
              <h3>{t("contact.info.locationTitle")}</h3>
              <p>{t("contact.location")}</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Hadapsar%2C%20Pune%2C%20Maharashtra%20411013"
                target="_blank"
                rel="noreferrer"
                className="contact-card-link"
              >
                {t("contact.info.directions")}
                <i className="bi bi-arrow-up-right"></i>
              </a>
            </article>

            <article className="contact-info-card">
              <div className="contact-info-icon">
                <i className="bi bi-calendar2-check"></i>
              </div>
              <h3>{t("contact.info.plansTitle")}</h3>
              <p>{t("contact.info.plansDescription")}</p>
              <a href="#tiffin-enquiry" className="contact-card-link">
                {t("contact.info.explorePlans")}
                <i className="bi bi-arrow-right"></i>
              </a>
            </article>

            <article className="contact-info-card">
              <div className="contact-info-icon">
                <i className="bi bi-chat-dots"></i>
              </div>
              <h3>{t("contact.info.mealTitle")}</h3>
              <p>{t("contact.info.mealDescription")}</p>
              <a href="#tiffin-enquiry" className="contact-card-link">
                {t("contact.info.sendEnquiry")}
                <i className="bi bi-arrow-right"></i>
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
                {t("contact.formInfo.eyebrow")}
              </span>

              <h2>{t("contact.formInfo.title")}</h2>

              <p>{t("contact.formInfo.description")}</p>

              <div className="contact-promise-list">
                <div className="contact-promise-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{t("contact.formInfo.promise1")}</span>
                </div>

                <div className="contact-promise-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{t("contact.formInfo.promise2")}</span>
                </div>

                <div className="contact-promise-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{t("contact.formInfo.promise3")}</span>
                </div>
              </div>

              <div className="contact-location-note">
                <i className="bi bi-geo-alt-fill"></i>
                <div>
                  <strong>{t("contact.info.locationTitle")}</strong>
                  <p>{t("contact.location")}</p>
                </div>
              </div>
            </div>

            <div className="contact-form-card">
              <div className="contact-form-heading">
                <h3>{t("contact.form.title")}</h3>
                <p>{t("contact.form.requiredNote")}</p>
              </div>

              {submitted && (
                <div className="contact-success-message" role="status">
                  <i className="bi bi-check-circle-fill"></i>
                  {t("contact.form.success")}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="customerName">
                      {t("contact.form.fullName")}
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      placeholder={t("contact.form.fullNamePlaceholder")}
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="customerPhone">
                      {t("contact.form.mobile")}
                    </label>
                    <input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      placeholder={t("contact.form.mobilePlaceholder")}
                      autoComplete="tel"
                      pattern="[0-9+\-\s()]{10,15}"
                      title={t("contact.form.phoneValidation")}
                      required
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="customerEmail">
                    {t("contact.form.email")}
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    placeholder={t("contact.form.emailPlaceholder")}
                    autoComplete="email"
                  />
                </div>

                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="tiffinPlan">
                      {t("contact.form.preferredPlan")}
                    </label>
                    <select
                      id="tiffinPlan"
                      name="tiffinPlan"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        {t("contact.form.selectPlan")}
                      </option>
                      <option value="Daily Tiffin">
                        {t("contact.form.dailyPlan")}
                      </option>
                      <option value="Weekly Plan">
                        {t("contact.form.weeklyPlan")}
                      </option>
                      <option value="Monthly Plan">
                        {t("contact.form.monthlyPlan")}
                      </option>
                      <option value="Custom Enquiry">
                        {t("contact.form.otherEnquiry")}
                      </option>
                    </select>
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="mealPreference">
                      {t("contact.form.mealPreference")}
                    </label>
                    <select
                      id="mealPreference"
                      name="mealPreference"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        {t("contact.form.selectPreference")}
                      </option>
                      <option value="Vegetarian">
                        {t("contact.form.vegetarian")}
                      </option>
                      <option value="Special Meal Enquiry">
                        {t("contact.form.specialMeal")}
                      </option>
                      <option value="Other Requirements">
                        {t("contact.form.otherRequirements")}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="deliveryAddress">
                    {t("contact.form.deliveryAddress")}
                  </label>
                  <input
                    type="text"
                    id="deliveryAddress"
                    name="deliveryAddress"
                    placeholder={t("contact.form.addressPlaceholder")}
                    autoComplete="street-address"
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="additionalRequirements">
                    {t("contact.form.additionalRequirements")}
                  </label>
                  <textarea
                    id="additionalRequirements"
                    name="additionalRequirements"
                    rows={4}
                    placeholder={t("contact.form.additionalPlaceholder")}
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn">
                  {t("contact.form.submit")}
                  <i className="bi bi-arrow-right"></i>
                </button>

                <p className="contact-form-disclaimer">
                  {t("contact.form.disclaimer")}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-benefits-section">
        <div className="container">
          <div className="contact-section-heading">
            <span className="contact-eyebrow">
              {t("contact.benefits.eyebrow")}
            </span>
            <h2>{t("contact.benefits.title")}</h2>
            <p>{t("contact.benefits.description")}</p>
          </div>

          <div className="contact-benefits-grid">
            <article className="contact-benefit-card">
              <i className="bi bi-house-heart"></i>
              <h3>{t("contact.benefits.homeTitle")}</h3>
              <p>{t("contact.benefits.homeDescription")}</p>
            </article>

            <article className="contact-benefit-card">
              <i className="bi bi-calendar-week"></i>
              <h3>{t("contact.benefits.flexibleTitle")}</h3>
              <p>{t("contact.benefits.flexibleDescription")}</p>
            </article>

            <article className="contact-benefit-card">
              <i className="bi bi-bicycle"></i>
              <h3>{t("contact.benefits.deliveryTitle")}</h3>
              <p>{t("contact.benefits.deliveryDescription")}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="contact-faq-section">
        <div className="container">
          <div className="contact-section-heading">
            <span className="contact-eyebrow">
              {t("contact.faq.eyebrow")}
            </span>
            <h2>{t("contact.faq.title")}</h2>
            <p>{t("contact.faq.description")}</p>
          </div>

          <div className="contact-faq-list">
            {faqKeys.map((key) => (
              <details className="contact-faq-item" key={key}>
                <summary>
                  <span>{t(`contact.faq.items.${key}.question`)}</span>
                  <i className="bi bi-plus-lg"></i>
                </summary>
                <p>{t(`contact.faq.items.${key}.answer`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-map-section">
        <div className="container">
          <div className="contact-map-heading">
            <div>
              <span className="contact-eyebrow">
                {t("contact.map.eyebrow")}
              </span>
              <h2>{t("contact.map.title")}</h2>
              <p>{t("contact.location")}</p>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Hadapsar%2C%20Pune%2C%20Maharashtra%20411013"
              target="_blank"
              rel="noreferrer"
              className="contact-map-link"
            >
              {t("contact.map.openMaps")}
              <i className="bi bi-arrow-up-right"></i>
            </a>
          </div>

          <div className="contact-map-frame">
            <iframe
              title={t("contact.map.frameTitle")}
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
