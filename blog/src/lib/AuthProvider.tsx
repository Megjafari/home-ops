import { useState, type ReactNode } from "react";
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

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}