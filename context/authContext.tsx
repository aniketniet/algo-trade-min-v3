"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
  user: any;
  loading: boolean;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("token");
      const storedUser = localStorage.getItem("user");
      
      if (token && storedUser) {
        try {
          // Optionally verify token with backend
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Auth check failed:", error);
          logout();
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const register = async (data: { username: string; email: string; password: string }) => {
    try {
      const res = await axios.post("http://localhost:4000/api/auth/register", data);
      const { user: userData, token } = res.data;
      
      // Store token in cookie (secure, httpOnly options would be server-side)
      Cookies.set("token", token, { expires: 7 }); // Expires in 7 days
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      router.push("/login");
    } catch (error: any) {
      console.error("Register error:", error.response?.data || error.message);
      throw error;
    }
  };

  const login = async (data: { email: string; password: string }) => {
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", data);
      const { user: userData, token } = res.data;
      
      // Store token in cookie
      Cookies.set("token", token, { expires: 7 }); // Expires in 7 days
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      router.push("/dashboard"); // Changed from "/login" to "/dashboard"
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};