
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    navigate("/");
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-logo">
            <i className="bi bi-egg-fried" />
          </div>

          <div className="admin-brand-text">
            <h2>Aapla Dabba</h2>
            <p>ADMIN WORKSPACE</p>
          </div>
        </div>

        <div className="admin-sidebar-label">MAIN MENU</div>

        <nav className="admin-sidebar-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "admin-nav-active" : ""}`
            }
          >
            <i className="bi bi-grid-1x2-fill" />
            <span>Dashboard</span>
            <i className="bi bi-chevron-right admin-nav-arrow" />
          </NavLink>

          <NavLink
            to="/admin/kitchen"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "admin-nav-active" : ""}`
            }
          >
            <i className="bi bi-shop" />
            <span>Kitchens</span>
            <i className="bi bi-chevron-right admin-nav-arrow" />
          </NavLink>

          <NavLink
            to="/admin/menu-categories"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "admin-nav-active" : ""}`
            }
          >
            <i className="bi bi-tags" />
            <span>Menu Categories</span>
            <i className="bi bi-chevron-right admin-nav-arrow" />
          </NavLink>

          {/* Menu Items */}
          <NavLink
            to="/admin/menu-items"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "admin-nav-active" : ""}`
            }
          >
            <i className="bi bi-egg-fried" />
            <span>Menu Items</span>
            <i className="bi bi-chevron-right admin-nav-arrow" />
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "admin-nav-active" : ""}`
            }
          >
            <i className="bi bi-receipt" />
            <span>Orders</span>
            <i className="bi bi-chevron-right admin-nav-arrow" />
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "admin-nav-active" : ""}`
            }
          >
            <i className="bi bi-people" />
            <span>Customers</span>
            <i className="bi bi-chevron-right admin-nav-arrow" />
          </NavLink>
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
        <header className="admin-topbar">
          <div className="admin-topbar-heading">
            <span className="admin-topbar-eyebrow">
              AAPLA DABBA / MANAGEMENT
            </span>
            <h1>Admin Workspace</h1>
            <p>Manage your kitchens, meals and business operations.</p>
          </div>

          <div className="admin-topbar-right">
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

        <section className="admin-page-content">
          <Outlet />
        </section>

        <footer className="admin-content-footer">
          <span>© {new Date().getFullYear()} Aapla Dabba</span>
          <span>Made with care for your food business</span>
        </footer>
      </main>
    </div>
  );
}

export default AdminLayout;
