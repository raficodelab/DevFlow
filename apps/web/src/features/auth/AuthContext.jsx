import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";

const STORAGE_KEY = "devflow_demo_user";

function getSavedUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  function login({ email }) {
    setUser({
      id: "demo-user",
      name: email.split("@")[0],
      email,
    });
  }

  function signup({ name, email }) {
    setUser({
      id: "demo-user",
      name,
      email,
    });
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}