
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="admin-dashboard-content">
      <div className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">
            {t("adminDashboard.overview")}
          </span>

          <h2>{t("adminDashboard.welcome")}</h2>

          <p>{t("adminDashboard.description")}</p>
        </div>

        <button
          className="dashboard-kitchen-btn"
          onClick={() => navigate("/admin/kitchen")}
        >
          <i className="bi bi-shop me-2" />
          {t("adminDashboard.manageKitchens")}
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon kitchen-icon">
            <i className="bi bi-shop" />
          </div>
          <p>{t("adminDashboard.totalKitchens")}</p>
          <h3>{t("adminDashboard.kitchenManagement")}</h3>
          <span>{t("adminDashboard.kitchenDescription")}</span>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon menu-icon">
            <i className="bi bi-egg-fried" />
          </div>
          <p>{t("adminDashboard.menuManagement")}</p>
          <h3>{t("adminDashboard.manageMenu")}</h3>
          <span>{t("adminDashboard.menuDescription")}</span>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon order-icon">
            <i className="bi bi-receipt" />
          </div>
          <p>{t("adminDashboard.orderManagement")}</p>
          <h3>{t("adminDashboard.manageOrders")}</h3>
          <span>{t("adminDashboard.orderDescription")}</span>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon customer-icon">
            <i className="bi bi-people" />
          </div>
          <p>{t("adminDashboard.customers")}</p>
          <h3>{t("adminDashboard.customerManagement")}</h3>
          <span>{t("adminDashboard.customerDescription")}</span>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h4>{t("adminDashboard.quickActions")}</h4>
            <p>{t("adminDashboard.quickActionsDescription")}</p>
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
            <strong>{t("adminDashboard.kitchenManagement")}</strong>
            <small>{t("adminDashboard.kitchenActionDescription")}</small>
          </span>

          <i className="bi bi-arrow-up-right ms-auto" />
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
