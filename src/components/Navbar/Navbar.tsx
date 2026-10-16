import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown("");
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown((current) => (current === name ? "" : name));
  };

  return (
    <nav className="navbar navbar-expand-lg aapla-navbar">
      <div className="container-fluid px-3 px-lg-5">

       <Link to="/" className="navbar-brand aapla-brand" onClick={closeMenu}>
            <img src="/images/logo.jpg" alt="Aapla Dabba Logo" className="aapla-logo"/>

            <span className="brand-text">Aapla <strong>Dabba</strong><small>GHARGHUTI JEVAAN, ROJ NAVIN</small></span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler aapla-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`}></i>
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
               {/* About Us Dropdown */}
            <li
              className={`nav-item dropdown aapla-dropdown ${
                openDropdown === "about" ? "dropdown-open" : ""
              }`}
              onMouseEnter={() => {
                if (window.innerWidth >= 992) {
                  setOpenDropdown("about");
                }
              }}
              onMouseLeave={() => setOpenDropdown("")}
            >
              <button
                type="button"
                className="nav-link dropdown-toggle aapla-dropdown-toggle"
                aria-expanded={openDropdown === "about"}
                onClick={() => toggleDropdown("about")}
              >
                About Us
                <i className="bi bi-chevron-down dropdown-arrow"></i>
              </button>

              <ul className="dropdown-menu aapla-dropdown-menu">
                <li>
                  <Link
                    to="/about#our-story"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-info-circle me-2"></i>
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about#why-choose-us"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-heart me-2"></i>
                    Why Choose Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about#our-kitchen"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-journal-text me-2"></i>
                    Our Kitchen
                  </Link>
                </li>
              </ul>
            </li>

            {/* Our Menu Dropdown */}
            <li
              className={`nav-item dropdown aapla-dropdown ${
                openDropdown === "menu" ? "dropdown-open" : ""
              }`}
              onMouseEnter={() => {
                if (window.innerWidth >= 992) {
                  setOpenDropdown("menu");
                }
              }}
              onMouseLeave={() => setOpenDropdown("")}
            >
              <button
                type="button"
                className="nav-link dropdown-toggle aapla-dropdown-toggle"
                aria-expanded={openDropdown === "menu"}
                onClick={() => toggleDropdown("menu")}
              >
                Our Menu
                <i className="bi bi-chevron-down dropdown-arrow"></i>
              </button>

              <ul className="dropdown-menu aapla-dropdown-menu">
                <li>
                  <Link
                    to="/menu"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-grid me-2"></i>
                    All Meals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/menu"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-egg-fried me-2"></i>
                    Daily Tiffin
                  </Link>
                </li>
                <li>
                  <Link
                    to="/menu"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-heart-pulse me-2"></i>
                    Healthy Meals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/menu"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-stars me-2"></i>
                    Special Dishes
                  </Link>
                </li>
              </ul>
            </li>

            {/* Meal Plans */}
            <li
              className={`nav-item dropdown aapla-dropdown ${
                openDropdown === "plans" ? "dropdown-open" : ""
              }`}
              onMouseEnter={() => {
                if (window.innerWidth >= 992) {
                  setOpenDropdown("plans");
                }
              }}
              onMouseLeave={() => setOpenDropdown("")}
            >
              <button
                type="button"
                className="nav-link dropdown-toggle aapla-dropdown-toggle"
                aria-expanded={openDropdown === "plans"}
                onClick={() => toggleDropdown("plans")}
              >
                Meal Plans
                <i className="bi bi-chevron-down dropdown-arrow"></i>
              </button>

              <ul className="dropdown-menu aapla-dropdown-menu">
                <li>
                  <Link
                    to="/plans"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-calendar-day me-2"></i>
                    Daily Plan
                  </Link>
                </li>
                <li>
                  <Link
                    to="/plans"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-calendar-week me-2"></i>
                    Weekly Plan
                  </Link>
                </li>
                <li>
                  <Link
                    to="/plans"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-calendar-month me-2"></i>
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

          </ul>

          {/* Order Button */}
          <Link
            to="/plans"
            className="btn order-btn"
            onClick={closeMenu}
          >
            Order Your Dabba
            <i className="bi bi-arrow-up-right ms-2"></i>
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;