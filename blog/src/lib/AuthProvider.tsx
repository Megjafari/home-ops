import { useEffect, useState, type ReactNode } from "react";
import { UNAUTHORIZED_EVENT } from "./api";
import { AuthContext } from "./auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem("token")
  );

  const login = (newToken: string) => {
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
  };

  // Expired or invalid token: drop it so RequireAuth sends us to the login page.
  useEffect(() => {
    const onUnauthorized = () => {
      sessionStorage.removeItem("token");
      setToken(null);
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}