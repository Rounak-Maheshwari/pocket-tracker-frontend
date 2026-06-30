import React, { useState } from "react";
import { FiMail, FiLock, FiAlertCircle, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../stores/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, isLoading, error, setError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [validationError, setValidationError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    if (setError) setError(null);

    if (!email || !password) {
      setValidationError(
        "Please populate both email and password fields to request session clearance.",
      );
      return;
    }

    try {
      await login(email, password);
    } catch (err) {}
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 select-none"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`@import url('https://googleapis.com');`}</style>

      <div className="sm:mx-auto w-full max-w-md space-y-4">
        <div className="flex flex-col items-center text-center">
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Sign in to workspace
          </h2>
          <p className="mt-1.5 text-xs text-slate-400 max-w-xs leading-relaxed">
            Enter your authenticated account credentials to open your secure
            personal financial ledger core.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <form
          onSubmit={handleLoginSubmit}
          className="bg-white border border-indigo-100/70 p-6 sm:p-10 rounded-2xl shadow-[0_12px_40px_rgba(238,242,255,0.4)] space-y-6"
        >
          {(error || validationError) && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex gap-3 text-xs font-medium text-rose-700 animate-fadeIn">
              <FiAlertCircle className="text-base shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                {validationError || error}
              </span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiMail className="text-sm stroke-[2.2]" />
                </div>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValidationError("");
                    if (setError) setError(null);
                  }}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 pl-9 pr-3.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiLock className="text-sm stroke-[2.2]" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setValidationError("");
                    if (setError) setError(null);
                  }}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 pl-9 pr-3.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs uppercase tracking-wider h-11 px-4 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Authenticate Credentials{" "}
                <FiArrowRight className="text-sm stroke-[2.5]" />
              </>
            )}
          </button>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              New to this platform infrastructure?{" "}
              <button
                type="button"
                onClick={() => {
                  if (setError) setError(null);
                  navigate("/register");
                }}
                className="text-indigo-600 cursor-pointer font-bold hover:text-indigo-700 focus:outline-none transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
