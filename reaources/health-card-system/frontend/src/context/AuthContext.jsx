import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("hcs_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("hcs_user");
      }
    }
    setLoading(false);
  }, []);

  const persistSession = (authResponse) => {
    localStorage.setItem("hcs_token", authResponse.token);
    localStorage.setItem("hcs_user", JSON.stringify(authResponse));
    setUser(authResponse);
  };

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    persistSession(data);
    return data;
  };

  const registerPatient = async (payload) => {
    const { data } = await authApi.registerPatient(payload);
    persistSession(data);
    return data;
  };

  const registerDoctor = async (payload) => {
    const { data } = await authApi.registerDoctor(payload);
    persistSession(data);
    return data;
  };

  const registerPathologist = async (payload) => {
    const { data } = await authApi.registerPathologist(payload);
    persistSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("hcs_token");
    localStorage.removeItem("hcs_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, registerPatient, registerDoctor, registerPathologist, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
