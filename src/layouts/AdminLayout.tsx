import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
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
      label: "Dashboard",
    },
    {
      to: "/admin/kitchen",
      icon: "bi-shop",
      label: "Kitchens",
    },
    {
      to: "/admin/menu-categories",
      icon: "bi-tags",
      label: "Menu Categories",
    },
    {
      to: "/admin/menu-items",
      icon: "bi-egg-fried",
      label: "Menu Items",
    },
    {
      to: "/admin/orders",
      icon: "bi-receipt",
      label: "Orders",
    },
    {
      to: "/admin/customers",
      icon: "bi-people",
      label: "Customers",
    },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          className="admin-mobile-overlay"
          aria-label="Close navigation menu"
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
            <p>ADMIN WORKSPACE</p>
          </div>

          <button
            type="button"
            className="admin-sidebar-close"
            aria-label="Close menu"
            onClick={closeMobileMenu}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="admin-sidebar-label">MAIN MENU</div>

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

            <h6>Admin Workspace</h6>
            <p>Manage your food business in one place.</p>
          </div>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-left" />
            <span>Logout</span>
          </button>

          <div className="admin-sidebar-footer">
            <span className="admin-status-dot" />
            Workspace Active
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
            aria-label="Back"
            title="Back"
          >
            <i className="bi bi-arrow-left" />
          </button>

          <div className="admin-mobile-brand">
            <div className="admin-mobile-brand-icon">
              <i className="bi bi-egg-fried" />
            </div>

            <div>
              <strong>Aapla Dabba</strong>
              <span>Admin Panel</span>
            </div>
          </div>

          <button
            type="button"
            className={`admin-mobile-menu ${
              mobileMenuOpen ? "is-open" : ""
            }`}
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
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
              AAPLA DABBA / MANAGEMENT
            </span>

            <h1>Admin Workspace</h1>

            <p>
              Manage your kitchens, meals and business operations.
            </p>
          </div>

          <div className="admin-topbar-right">
            {/* Desktop Back to Home Button */}
            <button
              type="button"
              className="admin-desktop-home"
              onClick={handleBack}
              title="Go to Home Page"
            >
              <i className="bi bi-arrow-left" />
              <span>Back</span>
            </button>

            <div className="admin-live-status">
              <span className="admin-status-dot" />
              <span>System Online</span>
            </div>

            <div className="admin-user">
              <div className="admin-user-avatar">
                <i className="bi bi-person-fill" />
              </div>

              <div className="admin-user-info">
                <strong>Administrator</strong>
                <span>Admin Account</span>
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
          <span>© {new Date().getFullYear()} Aapla Dabba</span>
          <span>Made with care for your food business</span>
        </footer>
      </main>
    </div>
  );
}

export default AdminLayout;