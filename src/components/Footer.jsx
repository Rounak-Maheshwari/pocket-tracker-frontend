import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-slate-200/50 bg-white/40 backdrop-blur-xs mt-auto py-5"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-medium text-slate-400">
        <div className="flex items-center gap-1.5 select-none">
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>&copy; {currentYear} LedgerFlow Engine.</span>
        </div>

        <div className="flex items-center gap-5 tracking-tight">
          <span className="font-mono text-[10px] text-slate-300"></span>
        </div>
      </div>
    </footer>
  );
}
