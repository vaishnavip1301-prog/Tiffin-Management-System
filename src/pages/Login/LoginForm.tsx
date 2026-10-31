
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./LoginForm.css";

interface LoginFormProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  mode?: "admin" | "customer";
}

function LoginForm({
  onClose,
  onLoginSuccess,
  mode = "admin",
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (mode === "admin") {
      if (
        email.trim().toLowerCase() === "admin123@gmail.com" &&
        password === "Admin@123"
      ) {
        sessionStorage.setItem("adminLoggedIn", "true");
        onLoginSuccess();
        navigate("/admin/dashboard");
      } else {
        setError(t("login.errors.invalidCredentials"));
      }

      return;
    }

    // Temporary customer login until the backend API is connected.
    if (email.trim() && password.length > 0) {
      sessionStorage.setItem("customerLoggedIn", "true");
      sessionStorage.setItem("customerEmail", email.trim());

      onLoginSuccess();
      navigate("/order");
    } else {
      setError(t("login.errors.requiredFields"));
    }
  };

  return (
    <div className="login-form-card">
      <button
        type="button"
        className="login-form-close"
        onClick={onClose}
        aria-label={t("login.close")}
      >
        &times;
      </button>

      <div className="login-form-brand">
        <div className="login-form-icon">
          <i className="bi bi-person-circle"></i>
        </div>

        <h2>{t("login.title")}</h2>

        <p>{t("login.subtitle")}</p>
      </div>

      <form onSubmit={handleLogin}>
        <div className="login-form-field">
          <label htmlFor="login-email">
            {t("login.emailLabel")}
          </label>

          <div className="login-input-wrapper">
            <i className="bi bi-envelope"></i>

            <input
              id="login-email"
              type="email"
              placeholder={t("login.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="login-form-field">
          <label htmlFor="login-password">
            {t("login.passwordLabel")}
          </label>

          <div className="login-input-wrapper">
            <i className="bi bi-lock"></i>

            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword
                  ? t("login.hidePassword")
                  : t("login.showPassword")
              }
            >
              <i
                className={`bi ${
                  showPassword ? "bi-eye-slash" : "bi-eye"
                }`}
              ></i>
            </button>
          </div>
        </div>

        {error && (
          <div className="login-form-error" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <button type="submit" className="login-submit-btn">
          {t("login.submit")}
          <i className="bi bi-arrow-right ms-2"></i>
        </button>
      </form>

      <div className="login-form-footer">
        <i className="bi bi-shield-check me-1"></i>
        {t("login.secureMessage")}
      </div>
    </div>
  );
}

export default LoginForm;
