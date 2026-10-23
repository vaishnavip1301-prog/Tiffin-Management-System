import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
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
        setError("Invalid email or password. Please try again.");
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
      setError("Please enter your email and password.");
    }
  };

  return (
    <div className="login-form-card">
      <button
        type="button"
        className="login-form-close"
        onClick={onClose}
        aria-label="Close login form"
      >
        &times;
      </button>

      <div className="login-form-brand">
        <div className="login-form-icon">
          <i className="bi bi-person-circle"></i>
        </div>

        <h2>Login</h2>
        <p>Login to continue to Aapla Dabba</p>
      </div>

      <form onSubmit={handleLogin}>
        <div className="login-form-field">
          <label htmlFor="login-email">Email Address</label>

          <div className="login-input-wrapper">
            <i className="bi bi-envelope"></i>

            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="login-form-field">
          <label htmlFor="login-password">Password</label>

          <div className="login-input-wrapper">
            <i className="bi bi-lock"></i>

            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
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
          Login <i className="bi bi-arrow-right ms-2"></i>
        </button>
      </form>

      <div className="login-form-footer">
        <i className="bi bi-shield-check me-1"></i>
        Secure access to your account
      </div>
    </div>
  );
}

export default LoginForm;
