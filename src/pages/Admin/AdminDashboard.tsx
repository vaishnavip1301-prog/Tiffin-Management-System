
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard-content">
      <div className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">ADMIN OVERVIEW</span>
          <h2>Welcome back, Admin! 👋</h2>
          <p>Manage your Aapla Dabba website from one place.</p>
        </div>

        <button
          className="dashboard-kitchen-btn"
          onClick={() => navigate("/admin/kitchen")}
        >
          <i className="bi bi-shop me-2" />
          Manage Kitchens
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon kitchen-icon">
            <i className="bi bi-shop" />
          </div>
          <p>Total Kitchens</p>
          <h3>Kitchen Management</h3>
          <span>Create and update kitchen details</span>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon menu-icon">
            <i className="bi bi-egg-fried" />
          </div>
          <p>Menu Management</p>
          <h3>Manage Menu</h3>
          <span>Organize meals and dishes</span>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon order-icon">
            <i className="bi bi-receipt" />
          </div>
          <p>Order Management</p>
          <h3>Manage Orders</h3>
          <span>Review customer orders</span>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon customer-icon">
            <i className="bi bi-people" />
          </div>
          <p>Customers</p>
          <h3>Customer Management</h3>
          <span>Manage customer information</span>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h4>Quick Actions</h4>
            <p>Frequently used admin tools</p>
          </div>
          <i className="bi bi-lightning-charge" />
        </div>

        <button
          className="dashboard-action"
          onClick={() => navigate("/admin/kitchen")}
        >
          <span className="action-icon">
            <i className="bi bi-shop" />
          </span>
          <span>
            <strong>Kitchen Management</strong>
            <small>Create, view and update kitchens</small>
          </span>
          <i className="bi bi-arrow-up-right ms-auto" />
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
