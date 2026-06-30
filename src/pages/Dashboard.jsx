import React, { useState, useEffect, useCallback } from "react";
import { useFinance } from "../stores/AccountContext";
import {
  FiCalendar,
  FiArrowDownLeft,
  FiArrowUpRight,
  FiTrendingUp,
  FiAlertCircle,
  FiDatabase,
  FiLayers,
} from "react-icons/fi";

export default function Dashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const defaultStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  )
    .toISOString()
    .split("T")[0];
  const defaultEnd = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  )
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const fetchDashboardMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/finance/dashboard/?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to synchronize dynamic system telemetry metrics.",
        );
      }

      const data = await response.json();
      setDashboardData(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [startDate, endDate, API_BASE_URL]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchDashboardMetrics();
    }
  }, [fetchDashboardMetrics]);

  if (isLoading && !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 min-h-screen bg-[#F8FAFC]">
        <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-3 animate-pulse">
          Assembling Analytical Horizons...
        </span>
      </div>
    );
  }

  const analytics = dashboardData?.analytics || {
    savings: 0,
    total_inflows: 0,
    total_expenses: 0,
  };
  const accountsInfo = dashboardData?.accounts_info || {
    total_liquid_flow: 0,
    total_credit_dues: 0,
    total_bank_account_balance: 0,
    total_cash_account_balance: 0,
  };
  const categoryBreakdown = dashboardData?.category_breakdown || [];
  return (
    <div
      className="w-full min-h-screen bg-[#F8FAFC] py-4 animate-fadeIn"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto space-y-6 px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
          <div className="space-y-0.5">
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              Your Dashboard
            </h2>
          </div>

          <div className="bg-white border border-slate-200 p-2 rounded-xl flex flex-wrap items-center gap-2 shadow-xs w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-xs font-bold">
              <FiCalendar className="text-violet-500 shrink-0" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 focus:outline-none focus:border-violet-500 transition-all"
              />
              <span className="text-slate-300 px-0.5">➔</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 focus:outline-none focus:border-violet-500 transition-all"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 flex gap-2.5 text-xs font-medium text-indigo-700 animate-fadeIn">
            <FiAlertCircle className="text-sm shrink-0 mt-0.5" />
            <span className="font-mono">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between h-28">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>Total Inflows</span>
              <div className="w-5 h-5 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FiArrowDownLeft />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-mono">
                ₹
                {parseFloat(analytics.total_inflows || 0).toLocaleString(
                  "en-IN",
                )}
              </span>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Aggregate verified deposit rows
              </p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between h-28">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>Total Expenses</span>
              <div className="w-5 h-5 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FiArrowUpRight />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-mono">
                ₹
                {parseFloat(analytics.total_expenses || 0).toLocaleString(
                  "en-IN",
                )}
              </span>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Cost center outflow commitments
              </p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between h-28 bg-gradient-to-br from-violet-50/50 to-white">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>Net Savings Margin</span>
              <div className="w-5 h-5 rounded bg-violet-50 text-violet-600 flex items-center justify-center">
                <FiTrendingUp />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black tracking-tight text-violet-700 font-mono">
                ₹{parseFloat(analytics.savings || 0).toLocaleString("en-IN")}
              </span>
              <p className="text-[10px] text-violet-400 font-medium mt-0.5">
                Liquid cash delta retention buffer
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FiLayers className="text-xs" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                Outflow Proportional Weights
              </h3>
              <p className="text-[10px] text-slate-400">
                Category-wise resource allocations processed across the current
                time window.
              </p>
            </div>
          </div>

          {categoryBreakdown.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 border border-dashed rounded-xl font-medium">
              🍃 Zero cost distribution records registered inside this date
              range.
            </div>
          ) : (
            <div className="space-y-3.5 pt-1">
              {categoryBreakdown.map((item, idx) => {
                const catName =
                  item.category_details?.name ||
                  item.category__name ||
                  item.name ||
                  "Unassigned Costs";
                const catAmount = parseFloat(
                  item.total_amount || item.total || 0,
                );
                const catPercent = Math.round(
                  parseFloat(item.percentage || item.percent || 0),
                );

                return (
                  <div key={idx} className="space-y-1 group animate-fadeIn">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
                        {catName}
                      </span>
                      <div className="font-mono text-slate-400 space-x-2">
                        <span className="text-slate-700 font-bold font-sans">
                          ₹{catAmount.toLocaleString("en-IN")}
                        </span>
                        <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[10px] font-black">
                          {catPercent}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${catPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-3.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FiDatabase className="text-violet-500" /> Capital Allocation
              Pools
            </h4>
            <div className="divide-y divide-slate-100 text-xs font-medium">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">
                  Liquid Cash Flow Pool (Bank & Cash)
                </span>
                <span className="font-mono font-bold text-slate-800">
                  ₹
                  {parseFloat(
                    accountsInfo.total_liquid_flow || 0,
                  ).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Checking Bank Balances</span>
                <span className="font-mono font-bold text-slate-800">
                  ₹
                  {parseFloat(
                    accountsInfo.total_bank_account_balance || 0,
                  ).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Physical Pocket Cash</span>
                <span className="font-mono font-bold text-slate-800">
                  ₹
                  {parseFloat(
                    accountsInfo.total_cash_account_balance || 0,
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-3.5 bg-gradient-to-br from-rose-50/20 to-white border-l-4 border-l-rose-500">
            <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
              <FiAlertCircle className="text-rose-500" /> Outstanding Credit
              Loads
            </h4>
            <div className="divide-y divide-slate-100 text-xs font-medium">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-600">
                  Total Liability Credit Dues
                </span>
                <span className="font-mono font-black text-rose-600">
                  ₹
                  {parseFloat(
                    accountsInfo.total_credit_dues || 0,
                  ).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="py-2.5 text-[10px] text-slate-400 font-sans leading-relaxed">
                This represents your active revolving credit limits currently
                logged on disk columns. Keep outstanding utilization parameters
                below 30% to maximize profile metrics scores.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
