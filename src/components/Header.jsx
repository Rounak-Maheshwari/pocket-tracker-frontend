import React, { useState } from "react";
import {
  FiPlus,
  FiLogOut,
  FiSettings,
  FiActivity,
  FiLayers,
  FiCreditCard,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../stores/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header({
  activeTab,
  setActiveTab,
  onLogTransactionClick,
}) {
  const { userEmail, logout, isAuthenticated, login, register } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="w-full px-4 sm:px-6 lg:px-8 pt-5 pb-5"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <header className="max-w-6xl mx-auto bg-white/85 backdrop-blur-xl border border-indigo-100 rounded-2xl h-16 px-6 flex items-center justify-between shadow-[0_8px_30px_rgba(238,242,255,0.4)] transition-all duration-300">
        <div
          className="flex items-center gap-3 cursor-pointer group select-none"
          onClick={() => setActiveTab("dashboard")}
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center transition-all group-hover:bg-indigo-700 duration-200 shadow-sm shadow-indigo-600/20">
            <span className="text-white font-bold text-sm tracking-tighter">
              LF
            </span>
          </div>
          <div className="flex flex-col gap-0.3">
            <span className="font-bold text-sm tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              LedgerFlow
            </span>
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase -mt-0.5">
              Track your Wealth
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-indigo-50/50 border border-indigo-100/40 p-1 rounded-xl">
          <button
            onClick={() => navigate("/accounts")}
            className={`text-xs cursor-pointer font-semibold px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${
              activeTab === "accounts"
                ? "bg-white text-indigo-600 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FiCreditCard className="text-sm stroke-[2.5]" /> Accounts
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className={`text-xs cursor-pointer font-semibold px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-white text-indigo-600 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FiLayers className="text-sm stroke-[2.5]" /> Financial Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/transactions");
            }}
            className={`text-xs font-semibold px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${
              activeTab === "transactions"
                ? "bg-white text-indigo-600 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FiActivity className="text-sm stroke-[2.5]" /> Transactions
          </button>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={onLogTransactionClick}
            className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white font-semibold text-xs uppercase tracking-wider h-9 px-4 rounded-xl flex items-center gap-2 transition-all duration-150 active:scale-[0.98] select-none shadow-sm shadow-indigo-600/10"
          >
            <FiPlus className="text-sm stroke-[2.5]" />
            <span className="hidden sm:inline">Log Transaction</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-9 h-9 cursor-pointer rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-100/50 hover:border-indigo-200 focus:outline-none transition-all duration-150"
            >
              <FiUser className="text-base stroke-[2.5]" />
            </button>

            {profileDropdownOpen && (
              <>
                <div
                  className="fixed cursor-pointer inset-0 z-10 "
                  onClick={() => setProfileDropdownOpen(false)}
                ></div>

                <div className="absolute right-0 mt-3 w-52 bg-white border border-indigo-100/80 rounded-xl shadow-lg p-1.5 z-20 space-y-0.5 animate-fadeIn">
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <span className="text-[9px] block font-bold text-slate-400 uppercase tracking-widest">
                          Secure Workspace
                        </span>
                        <span className="text-xs font-bold text-indigo-600 block mt-0.5 truncate">
                          {userEmail || "admin@core"}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setActiveTab("profile");
                        }}
                        className="w-full flex items-center gap-2 text-left text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 p-2 rounded-lg transition-colors"
                      >
                        <FiSettings className="text-sm text-slate-400" />{" "}
                        Security Profile
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors border-t border-slate-100 mt-1"
                      >
                        <FiLogOut className="text-sm" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <span className="text-[9px] block font-bold text-slate-400 uppercase tracking-widest">
                          Guest Workspace
                        </span>
                        <span className="text-xs font-bold text-slate-500 block mt-0.5">
                          Please authenticate
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setActiveTab("login");
                        }}
                        className="w-full flex items-center gap-2 text-left text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/40 p-2 rounded-lg transition-colors"
                      >
                        Login
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setActiveTab("register");
                        }}
                        className="w-full flex items-center gap-2 text-left text-xs font-bold text-indigo-600 hover:bg-indigo-50/40 p-2 rounded-lg transition-colors"
                      >
                        Register / Sign-up
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
