
import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { apiRequest } from "../../services/api";

const TOKEN_KEY = "devflow_access_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    sessionStorage.getItem(TOKEN_KEY)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await apiRequest("/auth/me", { token });

        if (!cancelled) {
          setUser(response.data.user);
        }
      } catch {
        if (!cancelled) {
          sessionStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function login({ email, password }) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    sessionStorage.setItem(TOKEN_KEY, response.data.token);
    setUser(response.data.user);
    setToken(response.data.token);

    return response.data.user;
  }

  async function signup({ name, email, password }) {
    const response = await apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    sessionStorage.setItem(TOKEN_KEY, response.data.token);
    setUser(response.data.user);
    setToken(response.data.token);

    return response.data.user;
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
