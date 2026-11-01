
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleBack = () => {
    closeMobileMenu();
    navigate("/");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    closeMobileMenu();
    navigate("/");
  };

  const navLinks = [
    {
      to: "/admin/dashboard",
      icon: "bi-grid-1x2-fill",
      label: t("adminLayout.dashboard"),
    },
    {
      to: "/admin/kitchen",
      icon: "bi-shop",
      label: t("adminLayout.kitchens"),
    },
    {
      to: "/admin/states",
      icon: "bi-geo-alt",
      label: t("adminLayout.states"),
    },
    {
      to: "/admin/cities",
      icon: "bi-buildings",
      label: t("adminLayout.cities"),
    },
    {
      to: "/admin/areas",
      icon: "bi-map",
      label: t("adminLayout.areas"),
    },
    {
      to: "/admin/locations",
      icon: "bi-pin-map",
      label: t("adminLayout.locations"),
    },
    {
      to: "/admin/dietary-tags",
      icon: "bi-heart-pulse",
      label: t("adminLayout.dietaryTags"),
    },
    {
      to: "/admin/food-types",
      icon: "bi-tags",
      label: t("adminLayout.foodType"),
    },
    {
      to: "/admin/meal-types",
      icon: "bi-clock-history",
      label: t("adminLayout.mealType"),
    },
    {
      to: "/admin/menu-categories",
      icon: "bi-tags",
      label: t("adminLayout.menuCategories"),
    },
    {
      to: "/admin/menu-subcategories",
      icon: "bi-diagram-3",
      label: t("adminLayout.menuSubCategories"),
    },
    {
      to: "/admin/menu-items",
      icon: "bi-egg-fried",
      label: t("adminLayout.menuItems"),
    },
    {
      to: "/admin/cart",
      icon: "bi-cart3",
      label: t("adminLayout.cart"),
    },
    {
      to: "/admin/orders",
      icon: "bi-receipt",
      label: t("adminLayout.orders"),
    },
    {
      to: "/admin/customers",
      icon: "bi-people",
      label: t("adminLayout.customers"),
    },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          className="admin-mobile-overlay"
          aria-label={t("adminLayout.closeNavigation")}
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`admin-sidebar ${
          mobileMenuOpen ? "admin-sidebar-open" : ""
        }`}
      >
        <div className="admin-sidebar-brand">
          <div className="admin-brand-logo">
            <i className="bi bi-egg-fried" />
          </div>

          <div className="admin-brand-text">
            <h2>Aapla Dabba</h2>
            <p>{t("adminLayout.adminWorkspace")}</p>
          </div>

          <button
            type="button"
            className="admin-sidebar-close"
            aria-label={t("adminLayout.closeMenu")}
            onClick={closeMobileMenu}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="admin-sidebar-label">
          {t("adminLayout.mainMenu")}
        </div>

        <nav className="admin-sidebar-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `admin-nav-link ${
                  isActive ? "admin-nav-active" : ""
                }`
              }
            >
              <i className={`bi ${link.icon}`} />
              <span>{link.label}</span>
              <i className="bi bi-chevron-right admin-nav-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-help-card">
            <div className="admin-help-icon">
              <i className="bi bi-headset" />
            </div>

            <h6>{t("adminLayout.workspaceTitle")}</h6>
            <p>{t("adminLayout.workspaceDescription")}</p>
          </div>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-left" />
            <span>{t("adminLayout.logout")}</span>
          </button>

          <div className="admin-sidebar-footer">
            <span className="admin-status-dot" />
            {t("adminLayout.workspaceActive")}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Mobile Navigation Bar */}
        <div className="admin-mobile-topbar">
          <button
            type="button"
            className="admin-mobile-back"
            onClick={handleBack}
            aria-label={t("adminLayout.back")}
            title={t("adminLayout.back")}
          >
            <i className="bi bi-arrow-left" />
          </button>

          <div className="admin-mobile-brand">
            <div className="admin-mobile-brand-icon">
              <i className="bi bi-egg-fried" />
            </div>

            <div>
              <strong>Aapla Dabba</strong>
              <span>{t("adminLayout.adminPanel")}</span>
            </div>
          </div>

          <button
            type="button"
            className={`admin-mobile-menu ${
              mobileMenuOpen ? "is-open" : ""
            }`}
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={
              mobileMenuOpen
                ? t("adminLayout.closeMenu")
                : t("adminLayout.openMenu")
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="admin-sidebar"
          >
            <i
              className={`bi ${
                mobileMenuOpen ? "bi-x-lg" : "bi-list"
              }`}
            />
          </button>
        </div>

        {/* Desktop / Tablet Page Header */}
        <header className="admin-topbar">
          <div className="admin-topbar-heading">
            <span className="admin-topbar-eyebrow">
              {t("adminLayout.topbarEyebrow")}
            </span>

            <h1>{t("adminLayout.adminWorkspace")}</h1>

            <p>{t("adminLayout.headerDescription")}</p>
          </div>

          <div className="admin-topbar-right">
            {/* Desktop Back to Home Button */}
            <button
              type="button"
              className="admin-desktop-home"
              onClick={handleBack}
              title={t("adminLayout.goToHome")}
            >
              <i className="bi bi-arrow-left" />
              <span>{t("adminLayout.back")}</span>
            </button>

            <div className="admin-live-status">
              <span className="admin-status-dot" />
              <span>{t("adminLayout.systemOnline")}</span>
            </div>

            <div className="admin-user">
              <div className="admin-user-avatar">
                <i className="bi bi-person-fill" />
              </div>

              <div className="admin-user-info">
                <strong>{t("adminLayout.administrator")}</strong>
                <span>{t("adminLayout.adminAccount")}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Routed Page Content */}
        <section className="admin-page-content">
          <Outlet />
        </section>

        {/* Footer */}
        <footer className="admin-content-footer">
          <span>
            © {new Date().getFullYear()} Aapla Dabba
          </span>

          <span>{t("adminLayout.footerText")}</span>
        </footer>
      </main>
    </div>
  );
}

export default AdminLayout;
