
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, { token, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.message || "Something went wrong");
    error.status = response.status;
    error.details = result.errors;
    throw error;
  }

  return result;
}
