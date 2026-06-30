import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const accessToken = localStorage.getItem("access_token");
      const savedEmail = localStorage.getItem("email");

      if (accessToken && savedEmail) {
        setUserEmail(savedEmail);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    checkToken();
  }, []);

  // register functionality
  const register = async (username, email, password, confirmPassword) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/authenticate/register/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: username,
            email: email,
            password: password,
            password2: confirmPassword,
          }),
        },
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.detail || JSON.stringify(errData) || "Registration failed",
        );
      }

      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // login functionality
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.detail || "Invalid email or password credentials",
        );
      }

      const data = await response.json();

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("email", email);

      setUserEmail(email);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // logout functionality

  const logout = async () => {
    setIsLoading(true);
    const refreshToken = localStorage.getItem("refresh_token");
    const accessToken = localStorage.getItem("access_token");

    try {
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/api/token/blacklist/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      }
    } catch (err) {
      console.warn("Backend blacklist rejection skipped:", err.message);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("email");

      setUserEmail(null);
      setIsAuthenticated(false);
      setError(null);
      setIsLoading(false);
      navigate("/");
    }
  };

  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    setIsLoading(true);
    setError(null);
    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/authenticate/change-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Protected endpoint boundary
          },
          body: JSON.stringify({
            password: oldPassword,
            password1: newPassword,
            password2: confirmPassword,
          }),
        },
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.detail ||
            JSON.stringify(errData) ||
            "Failed to change password",
        );
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userEmail,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        setError,
        changePassword,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be deployed safely within an active AuthProvider window container",
    );
  }
  return context;
};
