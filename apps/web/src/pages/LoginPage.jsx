import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../features/auth/useAuth";
import "./AuthPage.css";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  if (user) return <Navigate to="/dashboard" replace />;

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Demo only: no password verification.
    login({ email: form.email.trim() });
    navigate("/dashboard", { replace: true });
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">DevFlow</div>

        <h1>Welcome back</h1>
        <p>Sign in to manage your projects and tasks.</p>

        <div className="auth-demo-notice">
          Demo mode — any valid email and 6+ character password works.
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            placeholder="Enter demo password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" className="auth-submit">
            <LogIn size={18} />
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>

        <Link to="/" className="auth-home-link">
          Back to Home
        </Link>
      </div>
    </main>
  );
}