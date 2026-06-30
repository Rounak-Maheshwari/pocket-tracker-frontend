import React, { useState, useEffect, useCallback } from "react";
import { useFinance } from "../stores/AccountContext";
import {
  FiPlus,
  FiGrid,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiRefreshCw,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiTrash2,
  FiCalendar,
  FiEdit3,
} from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Transactions() {
  const {
    accounts,
    transactions,
    isLoading,
    financeError,
    fetchAccounts,
    fetchTransactions,
    logTransaction,
    deleteTransaction,
    loadDynamicCategories,
    predefinedCategories,
    fetchTransactionType,
    transactionType,
  } = useFinance();

  const [targetMonth, setTargetMonth] = useState(
    new Date().toISOString().slice(5, 7),
  );
  const [targetYear, setTargetYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [amount, setAmount] = useState(transactionType[0] || null);
  const [txType, setTxType] = useState("");
  const [category, setCategory] = useState(null);
  const [notes, setNotes] = useState("");
  const [sourceAccount, setSourceAccount] = useState("");
  const [destinationAccount, setDestinationAccount] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const [eventDate, setEventDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchAccounts();
    // console.log(typeFilter);
    fetchTransactions(targetMonth, targetYear);
    fetchTransactionType();
  }, [targetMonth, targetYear, fetchAccounts, fetchTransactions]);

  useEffect(() => {
    setCategory(null);
    if (txType?.name) {
      loadDynamicCategories(txType.name);
    }
  }, [txType, loadDynamicCategories]);

  const handleLogTransaction = async (e) => {
    e.preventDefault();
    setFormError("");

    console.log(
      txType.id,
      category.id,
      sourceAccount,
      destinationAccount,
      eventDate,
      notes,
    );

    if (!amount || !category?.id) {
      setFormError(
        "Please settle your amount metrics and category selector choice options.",
      );
      return;
    }

    if (txType.name !== "INCOME" && !sourceAccount) {
      setFormError(
        "Please specify the primary source payment wallet to debit funds from.",
      );
      return;
    }

    if (
      (txType.name === "INCOME" || txType.name === "TRANSFER") &&
      !destinationAccount
    ) {
      setFormError(
        "Please select the target repository vault to credit funds into.",
      );
      return;
    }

    try {
      await logTransaction(
        parseFloat(amount),
        txType.id,
        category.id,
        sourceAccount ? parseInt(sourceAccount) : null,
        destinationAccount ? parseInt(destinationAccount) : null,
        eventDate,
        notes || "",
      );
      setAmount("");
      setCategory("");
      setNotes("");
      setIsFormOpen(false);
      fetchTransactions(targetMonth, targetYear);
    } catch (err) {}
  };

  const recentTransactions = [...transactions].slice(0, 5);

  const filteredTransactions = transactions.filter((tx) => {
    const txTypeName = tx.transaction_type_details?.name;

    if (typeFilter === "ALL") return true;
    return txTypeName === typeFilter;
  });

  return (
    <div
      className="w-full min-h-screen bg-[#F8FAFC] py-4 animate-fadeIn"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto space-y-6 px-4">
        <div className="space-y-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block pl-1">
            Activity Tracking Stream
          </span>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pl-1 -mt-1">
            Last 5 Transactions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {recentTransactions.length === 0 ? (
              <div className="sm:col-span-5 bg-white border border-dashed border-slate-200 p-4 rounded-xl text-center text-[11px] text-slate-400 font-medium">
                You don't hold any transactions
              </div>
            ) : (
              recentTransactions.map((tx) => {
                const isExpense =
                  tx.transaction_type_details.name === "EXPENSE";
                const isIncome = tx.transaction_type_details.name === "INCOME";
                return (
                  <div
                    key={tx.id}
                    className="bg-white border border-slate-100 p-3 rounded-xl shadow-xs flex sm:flex-col justify-between items-center sm:items-start gap-2 hover:border-violet-200 transition-all"
                  >
                    <div className="flex items-center sm:items-start gap-2 w-full truncate">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isIncome ? "bg-emerald-50 text-emerald-600" : isExpense ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"}`}
                      >
                        {isIncome ? (
                          <FiArrowDownLeft className="text-xs stroke-[2.5]" />
                        ) : isExpense ? (
                          <FiArrowUpRight className="text-xs stroke-[2.5]" />
                        ) : (
                          <FiRefreshCw className="text-xs stroke-[2.5]" />
                        )}
                      </div>
                      <div className="truncate w-full">
                        <h4 className="text-[11px] font-bold text-slate-800 truncate leading-none">
                          {tx.transaction_type_category_details?.name}
                        </h4>
                        <span className="text-[8px] font-mono font-bold text-slate-400 uppercase block mt-1">
                          {tx.transaction_type_details.name}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-black font-mono tracking-tight sm:mt-1 ${isIncome ? "text-emerald-600" : isExpense ? "text-rose-600" : "text-blue-600"}`}
                    >
                      {isIncome ? "+" : isExpense ? "-" : ""}₹
                      {parseFloat(tx.amount).toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white border border-violet-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="p-4 flex items-center justify-between cursor-pointer bg-slate-50/50 hover:bg-violet-50/20 transition-colors select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                <FiPlus className="stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  Log New Transaction...
                </h4>
              </div>
            </div>
            {isFormOpen ? (
              <FiChevronUp className="text-slate-400" />
            ) : (
              <FiChevronDown className="text-slate-400" />
            )}
          </div>

          {isFormOpen && (
            <form
              onSubmit={(e) => {
                handleLogTransaction(e);
              }}
              className="p-6 border-t border-slate-100 bg-white space-y-4 animate-fadeIn"
            >
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex gap-2.5 text-xs font-medium text-rose-700">
                  <FiAlertCircle className="text-sm shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                  Transaction Activity Type
                </label>
                <div className="bg-slate-50 border border-slate-200 p-1 rounded-xl grid grid-cols-3 gap-1 shadow-inner">
                  {transactionType.map((t) => {
                    const typeId = t.id;
                    const typeDisplayName = t.name || typeId;

                    const isTypeSelected = txType?.id === typeId;

                    return (
                      <button
                        key={typeId}
                        type="button"
                        onClick={() => {
                          setTxType(t);
                          setSourceAccount("");
                          setDestinationAccount("");
                        }}
                        className={`text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          isTypeSelected
                            ? "bg-violet-600 text-white shadow-sm scale-[1.01]"
                            : "text-slate-500 hover:text-slate-800 hover:bg-violet-50/40"
                        } cursor-pointer`}
                      >
                        {typeDisplayName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 animate-fadeIn relative">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                  Select Category
                </label>

                {predefinedCategories.length === 0 ? (
                  <span className="text-xs font-mono text-slate-400 block p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    Select a category
                  </span>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 flex items-center justify-between select-none cursor-pointer transition-all"
                    >
                      <span
                        className={
                          category
                            ? "text-slate-800 font-semibold"
                            : "text-slate-400"
                        }
                      >
                        {category
                          ? category.name
                          : "-- Choose Predefined Category --"}
                      </span>
                      <FiChevronDown
                        className={`text-slate-400 transition-transform duration-200 ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isCategoryDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setIsCategoryDropdownOpen(false)}
                        ></div>

                        <div className="absolute left-0 mt-1.5 w-full bg-white border border-violet-100 rounded-xl shadow-xl p-1.5 z-40 max-h-52 overflow-y-auto space-y-0.5 animate-fadeIn">
                          {predefinedCategories.map((catItem) => {
                            const categoryObj =
                              typeof catItem === "object" && catItem !== null
                                ? catItem
                                : { id: catItem, name: catItem };

                            const categoryId = categoryObj.id;
                            const categoryName = categoryObj.name || categoryId;
                            const isCatSelected = category?.id === categoryId;

                            return (
                              <button
                                key={categoryId}
                                type="button"
                                onClick={() => {
                                  setCategory(categoryObj);
                                  setIsCategoryDropdownOpen(false); // Close drawer list instantly upon option commit
                                }}
                                className={`w-full text-left text-xs font-semibold p-2.5 rounded-lg transition-all flex items-center justify-between ${
                                  isCatSelected
                                    ? "bg-violet-600 text-white shadow-xs font-bold"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-violet-50/40"
                                } cursor-pointer`}
                              >
                                <span>{categoryName}</span>
                                {isCatSelected && (
                                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Amount Value (₹)
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 text-xs font-semibold">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-3.5 text-xs font-medium font-mono text-slate-800 focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Event Calendar Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-bold font-mono text-slate-700 focus:outline-none focus:border-violet-500 focus:bg-white transition-all cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Additional Reference Notes
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <FiEdit3 className="text-xs stroke-[2.2]" />
                  </span>
                  <input
                    type="text"
                    placeholder="Add custom item tracking specifications, context parameters, or metadata lines..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                {txType.name !== "INCOME" && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      {txType.name === "TRANSFER"
                        ? "From Source Account / Wallet"
                        : "From Payment Account / Card (Debit)"}
                    </label>
                    <select
                      value={sourceAccount}
                      onChange={(e) => setSourceAccount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-violet-500 focus:bg-white cursor-pointer transition-all"
                    >
                      {/* ✅ FIXED: Stripped broken functional callback option wrapper */}
                      <option value="">-- Choose Source Node --</option>
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} (₹
                          {acc.account_type_details.name == "BANK" ||
                          acc.account_type_details.name == "CASH"
                            ? parseFloat(acc.balance || 0).toLocaleString(
                                "en-IN",
                              )
                            : parseFloat(
                                acc.available_credit || 0,
                              ).toLocaleString("en-IN")}
                          )
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(txType?.name === "INCOME" || txType?.name === "TRANSFER") && (
                  <div
                    className={`space-y-1.5 animate-fadeIn ${txType?.name === "INCOME" ? "col-span-1 sm:col-span-2" : ""}`}
                  >
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      {txType?.name === "TRANSFER"
                        ? "To Target Destination Account"
                        : "Into Deposit Account / Vault (Credit)"}
                    </label>
                    <select
                      value={destinationAccount}
                      onChange={(e) => setDestinationAccount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-violet-500 focus:bg-white cursor-pointer transition-all"
                    >
                      <option value="">-- Choose Target Node --</option>
                      {accounts.map((acc) => {
                        const accTypeName =
                          acc.account_type_details?.name || acc.account_type;

                        const isSameAsSource =
                          acc.id.toString() === sourceAccount;

                        const isCreditCardNode =
                          accTypeName === "CREDIT" ||
                          accTypeName === "CREDIT CARD";
                        if (txType?.name === "INCOME" && isCreditCardNode) {
                          return null;
                        }

                        return (
                          (!isSameAsSource || txType?.name === "INCOME") && (
                            <option key={acc.id} value={acc.id}>
                              {acc.name} (₹
                              {accTypeName === "BANK" || accTypeName === "CASH"
                                ? parseFloat(acc.balance || 0).toLocaleString(
                                    "en-IN",
                                  )
                                : parseFloat(
                                    acc.available_credit || 0,
                                  ).toLocaleString("en-IN")}
                              )
                            </option>
                          )
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-violet-600 text-white font-semibold text-xs uppercase tracking-wider h-11 px-4 rounded-xl flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              >
                Commit Transaction
              </button>
            </form>
          )}
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto relative">
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <FiCalendar />
            </div>
            <input
              type="month"
              value={`${targetYear}-${targetMonth}`}
              onChange={(e) => {
                if (e.target.value) {
                  const [y, m] = e.target.value.split("-");
                  setTargetYear(y);
                  setTargetMonth(m);
                }
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs font-bold font-mono text-slate-700 focus:outline-none focus:border-violet-500 w-full sm:w-auto cursor-pointer"
            />
          </div>
          <div className="bg-slate-100/60 p-1 rounded-xl flex items-center gap-1 overflow-x-auto shadow-inner w-full sm:w-auto">
            {["ALL", "EXPENSE", "INCOME", "TRANSFER"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setTypeFilter(f)}
                className={`text-[10px] font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${typeFilter === f ? "bg-white text-violet-600 shadow-xs font-bold" : "text-slate-400 hover:text-slate-700"} cursor-pointer`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner text="Syncing Timeline Feeds..." />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-violet-100/60 shadow-xs text-center text-xs text-slate-400 font-medium">
            🍃 No ledger entries found matching this date scope parameters.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTransactions.map((tx) => {
              const isExpense =
                tx.transaction_type_details?.name === "EXPENSE" ||
                tx.transaction_type === "EXPENSE";
              const isIncome =
                tx.transaction_type_details?.name === "INCOME" ||
                tx.transaction_type === "INCOME";
              const isTransfer =
                tx.transaction_type_details?.name === "TRANSFER" ||
                tx.transaction_type === "TRANSFER";

              const fromName = tx.from_account_details?.name || "Primary Vault";
              const toName = tx.to_account_details?.name || "Destination Vault";
              const categoryTitle =
                tx.transaction_type_category_details?.name || "General Expense";

              return (
                <div
                  key={tx.id}
                  className="bg-white border border-slate-100 p-4 rounded-xl shadow-[0_2px_12px_rgba(241,245,249,0.5)] hover:border-violet-200 hover:shadow-md transition-all flex items-center justify-between gap-4 group"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <div className="flex items-center gap-4 truncate">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? "bg-emerald-50 text-emerald-600"
                          : isExpense
                            ? "bg-rose-50 text-rose-600"
                            : "bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      {isIncome ? (
                        <FiArrowDownLeft className="text-sm stroke-[2.5]" />
                      ) : isExpense ? (
                        <FiArrowUpRight className="text-sm stroke-[2.5]" />
                      ) : (
                        <FiRefreshCw className="text-sm stroke-[2.5]" />
                      )}
                    </div>

                    <div className="truncate space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-800 tracking-tight leading-none truncate">
                          {categoryTitle}
                        </h4>
                        {tx.note && (
                          <span className="text-[10px] text-slate-400 font-medium truncate max-w-[160px] bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
                            {tx.note}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] font-medium text-slate-400">
                        <span className="font-mono text-slate-400/80 bg-slate-50 px-1 py-0.5 rounded border border-slate-100">
                          {tx.event_date || "Today"}
                        </span>

                        <span className="text-slate-300">•</span>

                        {isTransfer && (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-600 font-semibold">
                              {fromName}
                            </span>
                            <span className="text-indigo-500 font-bold px-0.5">
                              ➔
                            </span>
                            <span className="text-violet-600 font-semibold">
                              {toName}
                            </span>
                          </div>
                        )}
                        {isExpense && (
                          <div>
                            <span className="text-slate-400 mr-1">
                              Paid via:
                            </span>
                            <span className="text-rose-600 font-semibold">
                              {fromName}
                            </span>
                          </div>
                        )}
                        {isIncome && (
                          <div>
                            <span className="text-slate-400 mr-1">
                              Deposited to:
                            </span>
                            <span className="text-emerald-600 font-semibold">
                              {toName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className={`text-sm font-black font-mono tracking-tight ${
                        isIncome
                          ? "text-emerald-600"
                          : isExpense
                            ? "text-rose-600"
                            : "text-indigo-600"
                      }`}
                    >
                      {isIncome ? "+" : isExpense ? "-" : ""}₹
                      {parseFloat(tx.amount || 0).toLocaleString("en-IN")}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Delete this entry log row?")) {
                          deleteTransaction(tx.id, targetMonth, targetYear);
                        }
                      }}
                      className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all cursor-pointer shadow-xs"
                      title="Erase log row record"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
