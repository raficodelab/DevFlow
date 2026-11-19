
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../features/auth/useAuth";
import "./AuthPage.css";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <main className="auth-page">Loading...</main>;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">DevFlow</div>

        <h1>Welcome back</h1>
        <p>Sign in to manage your projects and tasks.</p>

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
            autoComplete="current-password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={submitting}
          >
            <LogIn size={18} />
            {submitting ? "Signing in..." : "Sign In"}
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
