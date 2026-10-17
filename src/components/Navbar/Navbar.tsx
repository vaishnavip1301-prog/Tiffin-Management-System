
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

            {/* Our Menu */}
            <li
              className={`nav-item dropdown aapla-dropdown ${
                openDropdown === "menu" ? "dropdown-open" : ""
              }`}
              onMouseEnter={() => handleDropdownEnter("menu")}
              onMouseLeave={handleDropdownLeave}
            >
              <div className="d-flex align-items-center">
                <NavLink
                  to="/menu"
                  end
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={closeMenu}
                >
                  Our Menu
                </NavLink>

                <button
                  type="button"
                  className="nav-link aapla-dropdown-toggle"
                  aria-label="Toggle Our Menu dropdown"
                  aria-expanded={openDropdown === "menu"}
                  onClick={() => toggleDropdown("menu")}
                >
                  <i
                    className={`bi ${
                      openDropdown === "menu"
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    }`}
                  />
                </button>
              </div>

              <ul
                className={`dropdown-menu aapla-dropdown-menu ${
                  openDropdown === "menu" ? "show" : ""
                }`}
              >
                <li>
                  <NavLink
                    to="/menu"
                    end
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-grid me-2" />
                    All Meals
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/menu/daily-meal"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-egg-fried me-2" />
                    Daily Tiffin
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/menu/healthy-meals"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-heart-pulse me-2" />
                    Healthy Meals
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/menu/special-dishes"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-stars me-2" />
                    Special Dishes
                  </NavLink>
                </li>
              </ul>
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
                    to="/plans"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-calendar-day me-2" />
                    Daily Plan
                  </Link>
                </li>

                <li>
                  <Link
                    to="/plans"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-calendar-week me-2" />
                    Weekly Plan
                  </Link>
                </li>

                <li>
                  <Link
                    to="/plans"
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
          </ul>

          {/* Order Button */}
          <Link
            to="/plans"
            className="btn order-btn"
            onClick={closeMenu}
          >
            Order Your Dabba
            <i className="bi bi-arrow-up-right ms-2" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
