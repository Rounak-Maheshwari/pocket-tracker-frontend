import React from "react";

export default function LoadingSpinner({ size = "lg", text = "Loading..." }) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 p-4">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full border-slate-100 dark:border-slate-800`}
        ></div>

        <div
          className={`absolute top-0 left-0 animate-spin rounded-full border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent ${sizeClasses[size]}`}
        ></div>
      </div>

      {text && (
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase animate-pulse dark:text-slate-400">
          {text}
        </span>
      )}
    </div>
  );
}
