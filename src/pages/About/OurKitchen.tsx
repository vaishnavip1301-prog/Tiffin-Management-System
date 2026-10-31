
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./OurKitchen.css";

function OurKitchen() {
  const { t } = useTranslation();

  const kitchenImages = [
    {
      image: "/images/t3.jpg",
      title: t("ourKitchen.gallery.image1.title"),
      description: t("ourKitchen.gallery.image1.description"),
    },
    {
      image: "/images/t4.jpg",
      title: t("ourKitchen.gallery.image2.title"),
      description: t("ourKitchen.gallery.image2.description"),
    },
    {
      image: "/images/t5.jpg",
      title: t("ourKitchen.gallery.image3.title"),
      description: t("ourKitchen.gallery.image3.description"),
    },
    {
      image: "/images/t6.jpg",
      title: t("ourKitchen.gallery.image4.title"),
      description: t("ourKitchen.gallery.image4.description"),
    },
    {
      image: "/images/t7.jpg",
      title: t("ourKitchen.gallery.image5.title"),
      description: t("ourKitchen.gallery.image5.description"),
    },
  ];

  return (
    <main className="our-kitchen-page">
      <section className="our-kitchen-hero">
        <div className="container">
          <span className="our-kitchen-label">
            {t("ourKitchen.hero.label")}
          </span>

          <h1>
            {t("ourKitchen.hero.title")}
            <br />
            <span>{t("ourKitchen.hero.titleHighlight")}</span>
          </h1>

          <p>{t("ourKitchen.hero.description")}</p>

          <Link to="/menu" className="our-kitchen-btn">
            {t("ourKitchen.hero.button")}
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>

      <section className="our-kitchen-intro">
        <div className="container">
          <div className="our-kitchen-heading">
            <span className="our-kitchen-label">
              {t("ourKitchen.intro.label")}
            </span>

            <h2>
              {t("ourKitchen.intro.title")}
              <span>{t("ourKitchen.intro.titleHighlight")}</span>
            </h2>

            <p>{t("ourKitchen.intro.description")}</p>
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
              <span className="our-kitchen-label">
                {t("ourKitchen.values.label")}
              </span>

              <h2>{t("ourKitchen.values.title")}</h2>
            </div>

            <p>{t("ourKitchen.values.description")}</p>
          </div>
        </div>
      </section>

      <section className="our-kitchen-cta">
        <div className="container our-kitchen-cta-inner">
          <div>
            <span className="our-kitchen-label">
              {t("ourKitchen.cta.label")}
            </span>

            <h2>{t("ourKitchen.cta.title")}</h2>

            <p>{t("ourKitchen.cta.description")}</p>
          </div>

          <Link to="/menu" className="our-kitchen-btn">
            {t("ourKitchen.cta.button")}
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default OurKitchen;
