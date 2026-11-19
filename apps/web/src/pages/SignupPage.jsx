
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../features/auth/useAuth";
import "./AuthPage.css";

export default function SignupPage() {
  const { user, loading, signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
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

        <h1>Create your account</h1>
        <p>Start managing your projects with DevFlow.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="signup-name">Full Name</label>
          <input
            id="signup-name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={(event) =>
              setForm({ ...form, name: event.target.value })
            }
          />

          <label htmlFor="signup-email">Email Address</label>
          <input
            id="signup-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            required
            minLength={8}
            maxLength={128}
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />

          <label htmlFor="signup-confirm">Confirm Password</label>
          <input
            id="signup-confirm"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={(event) =>
              setForm({ ...form, confirmPassword: event.target.value })
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
            <UserPlus size={18} />
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>

        <Link to="/" className="auth-home-link">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
