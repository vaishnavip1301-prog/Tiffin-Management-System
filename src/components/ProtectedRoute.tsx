
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const isAdminLoggedIn =
    sessionStorage.getItem("adminLoggedIn") === "true";

  if (!isAdminLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
