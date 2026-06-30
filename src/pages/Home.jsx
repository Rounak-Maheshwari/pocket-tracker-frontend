import React from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <nav className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-600/10">
            <span className="text-white font-extrabold text-sm">LC</span>
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">
            LedgerCore
          </span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-xl transition-all"
        >
          Sign In to Workspace
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-4 text-center py-12 sm:py-20 space-y-8 my-auto">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-none">
            Wealth tracking, re-engineered for{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              absolute clarity
            </span>
            .
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            An elegant, production-grade financial ledger framework built on
            secure multi-tenant isolation, high-performance single-table
            architectures, and real-time query filtering.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white font-semibold text-xs uppercase tracking-wider h-11 px-6 rounded-xl shadow-sm hover:shadow flex items-center gap-2 transition-all duration-150 active:scale-[0.99]"
          >
            Create Free Account{" "}
            <FiArrowRight className="text-sm stroke-[2.5]" />
          </button>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-200/60 text-left">
          <div className="bg-white p-5 border border-slate-200/60 rounded-2xl shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FiTrendingUp className="text-sm stroke-[2.5]" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Multi-Vault Tracking
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Govern concurrent checking accounts, liability credit balances,
              and cash pools under a unified layout grid.
            </p>
          </div>

          <div className="bg-white p-5 border border-slate-200/60 rounded-2xl shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FiCheckCircle className="text-sm stroke-[2.5]" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Automated Balance Healing
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Overridden model view hooks evaluate deletion parameters to
              instantly execute retroactive accounting calculations.
            </p>
          </div>

          <div className="bg-white p-5 border border-slate-200/60 rounded-2xl shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FiShield className="text-sm stroke-[2.5]" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Airtight Isolation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Database requests filter string queries strictly through token
              credentials, blocking cross-user vulnerability resource leaks.
            </p>
          </div>
        </section>
      </main>

      <footer className="w-full text-center border-t border-slate-200/40 py-5 text-[11px] font-medium text-slate-400 font-mono">
        &copy; {new Date().getFullYear()} LedgerCore Engine. Secured Pipeline
        Architecture.
      </footer>
    </div>
  );
}
