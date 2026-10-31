
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import LoginForm from "../pages/Login/LoginForm";
import "./MainLayout.css";

function MainLayout() {
  const [loginOpen, setLoginOpen] = useState(false);
  const { t } = useTranslation();

  // WhatsApp business number with country code.
  const whatsappNumber = "917028565830";

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />

      {/* Floating WhatsApp and Order Now Buttons */}
      <div className="floating-actions">
        <a
          href={`https://wa.me/${whatsappNumber}`}
          className="floating-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("mainLayout.whatsapp.ariaLabel")}
          title={t("mainLayout.whatsapp.title")}
        >
          <i className="bi bi-whatsapp" />
        </a>

        <button
          type="button"
          className="floating-order-btn"
          onClick={() => setLoginOpen(true)}
        >
          <i className="bi bi-bag-check" />

          <span>{t("mainLayout.orderNow")}</span>

          <i className="bi bi-arrow-up-right" />
        </button>
      </div>

      {/* Shared Login Form Popup */}
      {loginOpen && (
        <div
          className="admin-login-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setLoginOpen(false);
            }
          }}
        >
          <LoginForm
            mode="customer"
            onClose={() => setLoginOpen(false)}
            onLoginSuccess={() => {
              setLoginOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default MainLayout;
