"use client";

import { createContext, useContext, useEffect, useState } from "react";

import API from "@/utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
          setToken(storedToken);

          const { data } = await API.get("/api/auth/me");

          setUser(data.user);
        }
      } catch (error) {
        console.log(error);

        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);

    setToken(token);

    try {
      const { data } = await API.get("/api/auth/me");

      setUser(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
