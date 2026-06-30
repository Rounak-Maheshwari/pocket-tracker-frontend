import React from "react";
import {
  FiEdit2,
  FiTrash2,
  FiActivity,
  FiCreditCard,
  FiGlobe,
} from "react-icons/fi";
import { BsBank } from "react-icons/bs";

import { useFinance } from "../stores/AccountContext";

export default function AccountCard({ account, onEdit }) {
  const {
    id,
    name,
    balance,
    fixed_credit_limit,
    due_amount,
    account_type_details,
    account_type,
  } = account;

  let { deleteAccount } = useFinance();

  function handleDeleteBtn() {
    if (
      window.confirm(
        "Are you completely sure you want to permanently erase this asset tracking node?",
      )
    ) {
      try {
        deleteAccount(id);
      } catch (err) {
        console.error("Ledger removal interceptor failed:", err.message);
      }
    }
  }

  // Derive the clean account type name safely from your nested schema strings
  const typeStr = account_type_details?.name || account_type || "BANK";

  /**
   * CORPORATE MINIMALIST BANKING THEME ENGINE
   * Discards flashing meshes for solid, deep premium luxury card finishes
   */
  const getPremiumCardTheme = () => {
    switch (typeStr) {
      case "BANK":
      case "BANK ACCOUNT":
        return {
          cardBg:
            "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-slate-950",
          textPrimary: "text-white",
          textMuted: "text-slate-400/80",
          badge: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300",
          progressBg: "bg-slate-800",
          progressFill: "bg-indigo-400",
          label: "Total Liquid Bank Balance",
          icon: <BsBank className="text-white text-xs" />,
        };
      case "CASH":
      case "PHYSICAL WALLET":
        return {
          cardBg:
            "bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border-slate-950",
          textPrimary: "text-white",
          textMuted: "text-slate-400/80",
          badge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
          progressBg: "bg-slate-800",
          progressFill: "bg-emerald-400",
          label: "Physical Drawer Cash Pool",
          icon: <FiActivity className="text-white text-xs" />,
        };
      case "CREDIT":
      case "CREDIT CARD":
        return {
          cardBg:
            "bg-gradient-to-br from-[#4c0519] via-[#881337] to-[#4c0519] border-rose-950",
          textPrimary: "text-white",
          textMuted: "text-rose-200/60",
          // Rose-gold accent boundary tags
          badge: "bg-rose-400/10 border-rose-400/30 text-rose-300",
          progressBg: "bg-rose-950/60",
          progressFill: "bg-gradient-to-r from-rose-400 to-rose-300",
          label: "Available Credit Utilization Limit",
          icon: <FiCreditCard className="text-white text-xs" />,
        };
      default:
        return {
          cardBg:
            "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-950",
          textPrimary: "text-white",
          textMuted: "text-slate-400/80",
          badge: "bg-slate-500/10 border-slate-500/30 text-slate-300",
          progressBg: "bg-slate-800",
          progressFill: "bg-slate-400",
          label: "System Asset Account Node",
          icon: <FiGlobe className="text-white text-xs" />,
        };
    }
  };

  const theme = getPremiumCardTheme();

  // Computational rules to extract math limits safely
  const maxLimit = parseFloat(fixed_credit_limit || 0);
  const currentDue = parseFloat(due_amount || 0);
  const liquidBalance = parseFloat(balance || 0);

  const availableCreditRoom = Math.max(0, maxLimit - currentDue);
  const creditUsagePercentage =
    maxLimit > 0 ? Math.min(100, (availableCreditRoom / maxLimit) * 100) : 100;

  // Generate a clean pseudo-card numerical trailing suffix based on account ID row keys
  const lastFourDigits = String(id || "0000")
    .padStart(4, "0")
    .slice(-4);

  return (
    <div
      className="w-full max-w-sm inline-block group"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className={`relative p-6 rounded-2xl border ${theme.cardBg} transition-all duration-300 overflow-hidden flex flex-col justify-between h-48 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-xl hover:translate-y-[-2px]`}
      >
        {/* TOP ROW: BRANDING LOGOS, BADGES & INTERACTIVE EDIT/DELETE OVERLAYS */}
        <div className="flex items-start justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
              {theme.icon}
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-tight text-white truncate max-w-[120px]">
                {name}
              </h4>
              <span
                className={`inline-block text-[8px] font-bold font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border mt-0.5 ${theme.badge}`}
              >
                {typeStr}
              </span>
            </div>
          </div>

          {/* ACTION INTERFACE WRAPPER (Swaps card mask suffix for Edit/Delete buttons on hover) */}
          <div className="relative h-8 flex items-center justify-end min-w-[75px]">
            {/* Default State: Card Number Mask */}
            <div className="font-mono text-[10px] font-semibold tracking-widest text-white/30 transition-all duration-300 absolute right-0 group-hover:opacity-0 group-hover:translate-y-[-10px] group-hover:pointer-events-none">
              •••• {lastFourDigits}
            </div>

            {/* Hover State: Corporate Minimalist Utility Modifier Actions */}
            <div className="flex items-center gap-1.5 opacity-0 translate-y-[10px] pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto absolute right-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit && onEdit(account);
                }}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all active:scale-95 cursor-pointer"
                title="Edit Account parameters"
              >
                <FiEdit2 className="text-[10px]" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBtn(id);
                }}
                className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-300 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all active:scale-95 cursor-pointer"
                title="Erase Account vault node"
              >
                <FiTrash2 className="text-[10px]" />
              </button>
            </div>
          </div>
        </div>
        {/* BOTTOM METRICS PANEL ROW DISPLAY */}
        <div className="z-10 mt-auto">
          {typeStr === "CREDIT" || typeStr === "CREDIT CARD" ? (
            <div className="space-y-2.5">
              <div>
                <span
                  className={`text-2xl font-bold tracking-tight font-mono ${theme.textPrimary}`}
                >
                  ₹{availableCreditRoom.toLocaleString("en-IN")}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider block ${theme.textMuted} mt-0.5`}
                >
                  {theme.label}
                </span>
              </div>

              {/* Progress Utilization Tracking Line */}
              <div className="space-y-1">
                <div
                  className={`w-full h-1 ${theme.progressBg} rounded-full overflow-hidden relative`}
                >
                  <div
                    className={`h-full rounded-full ${theme.progressFill} transition-all duration-1000 ease-out`}
                    style={{ width: `${creditUsagePercentage}%` }}
                  />
                </div>
                <div
                  className={`flex justify-between items-center text-[9px] ${theme.textMuted} font-semibold tracking-tight font-mono`}
                >
                  <span>LIMIT: ₹{maxLimit.toLocaleString("en-IN")}</span>
                  <span>DUE: ₹{currentDue.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-end justify-between">
              <div className="space-y-0.5">
                <span
                  className={`text-2xl font-bold tracking-tight font-mono ${theme.textPrimary}`}
                >
                  ₹{liquidBalance.toLocaleString("en-IN")}
                </span>
                <p
                  className={`text-[9px] font-bold uppercase tracking-wider ${theme.textMuted}`}
                >
                  {theme.label}
                </p>
              </div>

              {/* Minimal Electronic Secure Indicator Chip Badge */}
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2 py-1 backdrop-blur-md">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-bold font-mono tracking-wider text-slate-300 uppercase leading-none">
                  SECURE
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
