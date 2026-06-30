import React, { useState } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiAlertCircle,
  FiArrowRight,
} from "react-icons/fi";
import { useAuth } from "../stores/AuthContext";
import { useNavigate, useNavigation } from "react-router-dom";

export default function Register() {
  const { register, isLoading, error, setError } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validationError, setValidationError] = useState("");

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 select-none"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`@import url('https://googleapis.com');`}</style>

      <div className="sm:mx-auto w-full max-w-md space-y-4">
        <div className="flex flex-col items-center text-center">
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Create your workspace
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white border border-indigo-100/70 p-6 sm:p-10 rounded-2xl shadow-[0_12px_40px_rgba(238,242,255,0.4)] space-y-6">
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
                Account User Name
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiUser className="text-sm stroke-[2.2]" />
                </div>
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setValidationError("");
                    if (setError) setError(null);
                  }}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 pl-9 pr-3.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

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
                  placeholder="Enter Email"
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
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Password
              </label>
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

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Confirm Password
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiLock className="text-sm stroke-[2.2]" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setValidationError("");
                    if (setError) setError(null);
                  }}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 pl-9 pr-3.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={async () => {
              if (!username || !email || !password || !confirmPassword) {
                setValidationError(
                  "Please complete all credential fields before dispatching registration metadata.",
                );
                return;
              }
              if (password !== confirmPassword) {
                setValidationError(
                  "The entry fields do not match. Verify your confirm password string.",
                );
                return;
              }
              try {
                await register(username, email, password, confirmPassword);
                navigate("/login");
              } catch (err) {}
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs uppercase tracking-wider h-11 px-4 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Sign Up <FiArrowRight className="text-sm stroke-[2.5]" />
              </>
            )}
          </button>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Already have an active credential profile?{" "}
              <button
                onClick={() => {
                  if (setError) setError(null);
                  navigate("/login");
                }}
                className="text-indigo-600 font-bold hover:text-indigo-700 focus:outline-none transition-colors cursor-pointer"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
