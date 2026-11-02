
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./About.css";

function About() {
  const location = useLocation();
  const { i18n } = useTranslation();

  const isMarathi = i18n.language.startsWith("mr");

  const content = isMarathi
    ? {
        heroLabel: "आपल्या आपला डब्बा बद्दल",
        heroTitle: "घरच्या जेवणाची चव,",
        heroHighlight: "प्रत्येक घासात",
        heroDescription:
          "तुमच्या रोजच्या जीवनात घरगुती भारतीय जेवणाची चव आणण्याचा आमचा प्रयत्न आहे. उत्तम साहित्य वापरून प्रेमाने तयार केलेले ताजे, स्वादिष्ट आणि पौष्टिक जेवण.",
        storyButton: "आमची कहाणी",
        menuButton: "मेनू पहा",
        imageCaption: "ताजे बनवलेले",
        imageTitle: "घरच्या जेवणाची चव",

        storyLabel: "आमची कहाणी",
        storyTitle: "दररोजच्या जेवणात घरच्या चवीची अनुभूती",
        story1:
          "आपला डब्बाची सुरुवात एका साध्या विचारातून झाली – प्रत्येकाला ताजे, स्वादिष्ट आणि घरगुती जेवण मिळावे.",
        story2:
          "आजच्या धावपळीच्या जीवनात स्वतःसाठी पौष्टिक आणि घरगुती जेवण बनवणे कठीण असते. म्हणूनच आम्ही पारंपरिक भारतीय पाककृतींवर आधारित ताजे जेवण तुमच्यापर्यंत पोहोचवतो.",
        story3:
          "तुमच्या घरच्या स्वयंपाकघरात जसे प्रेमाने जेवण बनते, त्याच काळजीने आणि स्वच्छतेने आम्ही प्रत्येक डब्बा तयार करतो. प्रत्येक घासात घरची चव देणे हेच आमचे ध्येय आहे.",
        storyLink: "आम्हालाच का निवडावे?",

        whyLabel: "आपला डब्बा का निवडावा?",
        whyTitle: "चांगले जेवण, प्रेमाने तयार केलेले",
        whyDescription:
          "आमच्या मते प्रत्येक जेवणामध्ये ताजेपणा, आनंद आणि घरच्या जेवणाची आपुलकी असली पाहिजे.",

        feature1Title: "अस्सल घरगुती चव",
        feature1Description:
          "पारंपरिक भारतीय पाककृती आणि घरगुती पद्धतीने बनवलेल्या स्वादिष्ट जेवणाचा आनंद घ्या.",

        feature2Title: "ताजे आणि उत्तम साहित्य",
        feature2Description:
          "दररोज ताजे, चविष्ट आणि समाधानकारक जेवण तयार करण्यासाठी आम्ही उत्तम साहित्य निवडतो.",

        feature3Title: "स्वच्छता आणि काळजी",
        feature3Description:
          "प्रत्येक जेवण स्वच्छता, गुणवत्ता आणि ग्राहकांच्या समाधानाची काळजी घेऊन तयार केले जाते.",

        feature4Title: "सोयीस्कर मील प्लॅन्स",
        feature4Description:
          "तुमच्या दैनंदिन गरजेनुसार डेली, वीकली आणि मंथली मील प्लॅन निवडा.",

        kitchenLabel: "आमचे स्वयंपाकघर",
        kitchenTitle: "आमच्या घरगुती जेवणाची एक झलक",
        kitchenDescription:
          "ताजे बनवलेले पदार्थ, पारंपरिक चव आणि प्रत्येक जेवणात घरगुती स्वाद.",

        ctaLabel: "तुमचा रोजचा जेवणाचा साथीदार",
        ctaTitle: "प्रत्येक जेवणात अनुभवा घरची चव",
        ctaDescription:
          "दररोज घरगुती जेवणाचा आनंद घ्या. आमचा स्वादिष्ट मेनू पहा आणि तुमच्या जीवनशैलीला योग्य असा मील प्लॅन निवडा.",
        ctaButton: "आमचा मेनू पहा",
      }
    : {
        heroLabel: "ABOUT AAPLA DABBA",
        heroTitle: "Homemade Taste,",
        heroHighlight: "Made With Love",
        heroDescription:
          "We bring the warmth of homemade Indian food to your everyday life. Enjoy fresh, delicious and nutritious meals prepared with quality ingredients, traditional recipes and care.",
        storyButton: "Discover Our Story",
        menuButton: "Explore Our Menu",
        imageCaption: "Freshly Prepared",
        imageTitle: "A Taste of Home",

        storyLabel: "OUR STORY",
        storyTitle: "Bringing the Taste of Home to Your Everyday Life",
        story1:
          "Aapla Dabba started with a simple idea – to make fresh, delicious and homestyle food available to everyone.",
        story2:
          "In today's busy lifestyle, finding time to prepare healthy homemade meals can be challenging. We make it easier by bringing freshly prepared meals inspired by traditional Indian cooking.",
        story3:
          "Every meal is prepared with love, hygiene and attention to quality, just like food made in your own kitchen. Our goal is to make every dabba feel like home.",
        storyLink: "Discover Why Choose Us",

        whyLabel: "WHY AAPLA DABBA",
        whyTitle: "Good Food, Made With Care",
        whyDescription:
          "We believe that every meal should bring happiness, freshness and the comforting taste of home.",

        feature1Title: "Authentic Homemade Taste",
        feature1Description:
          "Enjoy delicious meals inspired by traditional Indian recipes and homemade cooking.",

        feature2Title: "Fresh Quality Ingredients",
        feature2Description:
          "We carefully select ingredients to prepare fresh, tasty and satisfying meals every day.",

        feature3Title: "Hygiene and Care",
        feature3Description:
          "Every meal is prepared with attention to cleanliness, food quality and customer satisfaction.",

        feature4Title: "Flexible Meal Plans",
        feature4Description:
          "Choose from daily, weekly and monthly meal plans that suit your routine and lifestyle.",

        kitchenLabel: "OUR KITCHEN",
        kitchenTitle: "A Glimpse of Our Homemade Meals",
        kitchenDescription:
          "Freshly prepared food, traditional flavours and homemade goodness in every meal.",

        ctaLabel: "YOUR DAILY FOOD PARTNER",
        ctaTitle: "Make Every Meal Feel Like Home",
        ctaDescription:
          "Enjoy the comfort of homemade food every day. Explore our delicious menu and find the perfect meal plan for your lifestyle.",
        ctaButton: "Explore Our Menu",
      };

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <main className="about-page">

      {/* HERO SECTION */}
      <section className="about-hero">

        <div className="about-hero-content">

          <span className="about-label">
            {content.heroLabel}
          </span>

          <h1>
            {content.heroTitle}
            <span>{content.heroHighlight}</span>
          </h1>

          <p>{content.heroDescription}</p>

          <div className="about-buttons">

            <Link to="/about/our-story" className="about-btn-primary">
              {content.storyButton}
            </Link>

            <Link to="/menu" className="about-btn-secondary">
              {content.menuButton}
            </Link>

          </div>

        </div>

        <div className="about-hero-image">

          <img
            src="/images/t3.jpg"
            alt="Fresh homemade Indian tiffin meal"
          />

          <div className="about-image-caption">
            <span>{content.imageCaption}</span>
            <h3>{content.imageTitle}</h3>
          </div>

        </div>

      </section>


      {/* OUR STORY */}
      <section className="about-story" id="our-story">

        <div className="about-story-image">
          <img
            src="/images/t4.jpg"
            alt="Homemade Indian food"
          />
        </div>

        <div className="about-story-content">

          <span className="about-label">
            {content.storyLabel}
          </span>

          <h2>{content.storyTitle}</h2>

          <p>{content.story1}</p>

          <p>{content.story2}</p>

          <p>{content.story3}</p>

          <Link to="/about/why-choose-us" className="about-text-link">
            {content.storyLink} <span>→</span>
          </Link>

        </div>

      </section>


      {/* WHY CHOOSE US */}
      <section className="about-why" id="why-choose-us">

        <div className="about-heading">

          <span className="about-label">
            {content.whyLabel}
          </span>

          <h2>{content.whyTitle}</h2>

          <p>{content.whyDescription}</p>

        </div>

        <div className="about-features">

          <article className="about-feature-card">
            <span className="about-feature-number">01</span>
            <h3>{content.feature1Title}</h3>
            <p>{content.feature1Description}</p>
          </article>

          <article className="about-feature-card">
            <span className="about-feature-number">02</span>
            <h3>{content.feature2Title}</h3>
            <p>{content.feature2Description}</p>
          </article>

          <article className="about-feature-card">
            <span className="about-feature-number">03</span>
            <h3>{content.feature3Title}</h3>
            <p>{content.feature3Description}</p>
          </article>

          <article className="about-feature-card">
            <span className="about-feature-number">04</span>
            <h3>{content.feature4Title}</h3>
            <p>{content.feature4Description}</p>
          </article>

        </div>

      </section>


      {/* OUR KITCHEN / FOOD GALLERY */}
      <section className="about-kitchen" id="our-kitchen">

        <div className="about-heading">

          <span className="about-label">
            {content.kitchenLabel}
          </span>

          <h2>{content.kitchenTitle}</h2>

          <p>{content.kitchenDescription}</p>

        </div>

        <div className="about-gallery">

          <div className="about-gallery-item about-gallery-large">
            <img src="/images/t3.jpg" alt="Freshly prepared Indian thali" />
          </div>

          <div className="about-gallery-item">
            <img src="/images/meal.jpg" alt="Homemade Indian meal" />
          </div>

          <div className="about-gallery-item">
            <img src="/images/meal1.jpg" alt="Fresh Indian lunch" />
          </div>

          <div className="about-gallery-item">
            <img src="/images/meal2.jpg" alt="Traditional Indian food" />
          </div>

          <div className="about-gallery-item">
            <img src="/images/t7.jpg" alt="Healthy homemade meal" />
          </div>

        </div>

      </section>


      {/* CTA SECTION */}
      <section className="about-cta">

        <span className="about-label">
          {content.ctaLabel}
        </span>

        <h2>{content.ctaTitle}</h2>

        <p>{content.ctaDescription}</p>

        <Link to="/menu" className="about-btn-primary">
          {content.ctaButton}
        </Link>

      </section>

    </main>
  );
}

export default About;
