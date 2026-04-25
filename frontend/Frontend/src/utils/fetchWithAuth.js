import { API_BASE_URL } from "../config";

export const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem("token");

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      localStorage.clear();
      window.location.href = "/login";
      return response;
    }

    const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await refreshRes.json();

    if (!refreshRes.ok) {
      localStorage.clear();
      window.location.href = "/login";
      return response;
    }

    localStorage.setItem("token", data.accessToken);

    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${data.accessToken}`,
      },
    });
  }

  return response;
};
