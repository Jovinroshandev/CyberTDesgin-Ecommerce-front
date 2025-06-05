import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function useAuth() {
  const [user, setUser] = useState(null);

  const decodeToken = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        setUser(null);
      }
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return;

    try {
      const res = await axios.post("http://localhost:5000/token", {
        refreshToken,
      });
      const newAccessToken = res.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      decodeToken(); // re-decode user
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  };

  useEffect(() => {
    decodeToken();
    const interval = setInterval(refreshAccessToken, 10 * 60 * 1000); // 10 minutes
    return () => clearInterval(interval);
  }, []);

  return { user, isAuthenticated: !!user };
}
