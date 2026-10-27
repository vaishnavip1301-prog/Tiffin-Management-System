import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Navbar.css";
import LoginForm from "../../pages/Login/LoginForm";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);

  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (language: "en" | "mr") => {
    i18n.changeLanguage(language);
    localStorage.setItem("app-language", language);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown("");
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown((current) => (current === name ? "" : name));
  };

  const handleDropdownEnter = (name: string) => {
    if (window.innerWidth >= 992) {
      setOpenDropdown(name);
    }
  };

  const handleDropdownLeave = () => {
    if (window.innerWidth >= 992) {
      setOpenDropdown("");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg aapla-navbar">
        <div className="container-fluid px-3 px-lg-5">
          {/* Brand Logo */}
          <Link
            to="/"
            className="navbar-brand aapla-brand"
            onClick={closeMenu}
          >
            <img
              src="/images/logo.jpg"
              alt="Aapla Dabba Logo"
              className="aapla-logo"
            />

            <span className="brand-text">
              Aapla <strong>Dabba</strong>
              <small>GHARGHUTI JEVAAN, ROJ NAVIN</small>
            </span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler aapla-toggler"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`} />
          </button>

          {/* Navigation */}
          <div
            className={`collapse navbar-collapse ${
              menuOpen ? "show" : ""
            }`}
          >
            <ul className="navbar-nav mx-auto aapla-nav">
              {/* Home */}
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={closeMenu}
                >
                  Home
                </NavLink>
              </li>

              {/* About Dropdown */}
              <li
                className={`nav-item dropdown aapla-dropdown ${
                  openDropdown === "about" ? "dropdown-open" : ""
                }`}
                onMouseEnter={() => handleDropdownEnter("about")}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  className="nav-link aapla-dropdown-toggle"
                  aria-expanded={openDropdown === "about"}
                  onClick={() => toggleDropdown("about")}
                >
                  About Us
                  <i
                    className={`bi ms-2 ${
                      openDropdown === "about"
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    }`}
                  />
                </button>

                <ul
                  className={`dropdown-menu aapla-dropdown-menu ${
                    openDropdown === "about" ? "show" : ""
                  }`}
                >
                  <li>
                    <NavLink
                      to="/about"
                      end
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      <i className="bi bi-info-circle me-2" />
                      About Us
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/about/our-story"
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      <i className="bi bi-book me-2" />
                      Our Story
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/about/why-choose-us"
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      <i className="bi bi-patch-check me-2" />
                      Why Choose Us
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/about/our-kitchen"
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      <i className="bi bi-shop me-2" />
                      Our Kitchen
                    </NavLink>
                  </li>
                </ul>
              </li>

              {/* Our Menu - Direct Link */}
              <li className="nav-item">
                <NavLink
                  to="/menu"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={closeMenu}
                >
                  Our Menu
                </NavLink>
              </li>

              {/* Meal Plans */}
              <li
                className={`nav-item dropdown aapla-dropdown ${
                  openDropdown === "plans" ? "dropdown-open" : ""
                }`}
                onMouseEnter={() => handleDropdownEnter("plans")}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  className="nav-link aapla-dropdown-toggle aapla-plans-toggle"
                  aria-expanded={openDropdown === "plans"}
                  onClick={() => toggleDropdown("plans")}
                >
                  Meal Plans
                  <i
                    className={`bi ms-2 ${
                      openDropdown === "plans"
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    }`}
                  />
                </button>

                <ul
                  className={`dropdown-menu aapla-dropdown-menu ${
                    openDropdown === "plans" ? "show" : ""
                  }`}
                >
                  <li>
                    <Link
                      to="/mealplans/dailyplan"
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      <i className="bi bi-calendar-day me-2" />
                      Daily Plan
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/mealplans/weeklyplan"
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      <i className="bi bi-calendar-week me-2" />
                      Weekly Plan
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/mealplans/monthlyplan"
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      <i className="bi bi-calendar-month me-2" />
                      Monthly Plan
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Contact */}
              <li className="nav-item">
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={closeMenu}
                >
                  Contact
                </NavLink>
              </li>

              {/* Language Switch */}
              <li className="nav-item">
                <div className="aapla-language-switch">
                  <button
                    type="button"
                    className={
                      i18n.language.startsWith("en") ? "active" : ""
                    }
                    onClick={() => changeLanguage("en")}
                  >
                    En
                  </button>

                  <button
                    type="button"
                    className={
                      i18n.language.startsWith("mr") ? "active" : ""
                    }
                    onClick={() => changeLanguage("mr")}
                  >
                    म
                  </button>
                </div>
              </li>

              {/* Login */}
              <li className="nav-item">
                <button
                  type="button"
                  className="nav-link aapla-login-link"
                  onClick={() => {
                    setLoginOpen(true);
                    closeMenu();
                  }}
                >
                  <i className="bi bi-person-circle me-2" />
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Login Popup */}
      {loginOpen && (
        <div
          className="admin-login-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setLoginOpen(false);
            }
          }}
        >
          <LoginForm
            onClose={() => setLoginOpen(false)}
            onLoginSuccess={() => {
              setLoginOpen(false);
              navigate("/admin/dashboard");
            }}
          />
        </div>
      )}
    </>
  );
}

export default Navbar;
