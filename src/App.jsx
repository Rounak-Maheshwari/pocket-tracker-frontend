import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./stores/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LoadingSpinner from "./components/LoadingSpinner";
import Accounts from "./pages/Account";
import Transactions from "./pages/Transactions";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. SESSION LOADING GUARDRAIL: Freeze compiling until cached browser tokens are synced
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          itemsCenter: "center",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  // 2. SHELL CONTROLLER CONDITION: Determine if the header/footer bars should mount
  const publicPaths = ["/", "/login", "/register"];
  const showNavigationShell =
    !publicPaths.includes(location.pathname) && isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Structural Floating Navigation Shell mounts dynamically upon active authentication */}
      {showNavigationShell && (
        <Header activeTab={location.pathname.substring(1)} />
      )}

      <main className="flex-grow">
        <Routes>
          {/* ─── PUBLIC OPEN UNPROTECTED CHANNELS ─── */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />
            }
          />

          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />

          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register />
              )
            }
          />
          {/* ─── SECURE PROTECTED WORKSPACE DATA pages ─── */}
          <Route
            path="/accounts"
            element={
              isAuthenticated ? <Accounts /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/transactions"
            element={
              isAuthenticated ? (
                <Transactions />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </main>

      {showNavigationShell && <Footer />}
    </div>
  );
}
