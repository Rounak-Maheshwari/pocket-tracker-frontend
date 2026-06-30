import React, { useState, useEffect } from "react";
import { useFinance } from "../stores/AccountContext";
import AccountCard from "../components/Card";
import {
  FiPlus,
  FiGrid,
  FiActivity,
  FiCreditCard,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiX,
} from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";

function Account({ onNavigate }) {
  const {
    accounts,
    categories,
    isLoading,
    financeError,
    fetchAccounts,
    fetchCategories,
    createAccount,
    updateAccount,
    deleteAccount,
  } = useFinance();

  const [filterMode, setFilterMode] = useState("ALL");
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("BANK");
  const [balance, setBalance] = useState("");
  const [limit, setLimit] = useState("");
  const [dueAmount, setDueAmount] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const cleanTypeStr = filterMode === "ALL" ? "ALL" : filterMode;
      fetchAccounts(cleanTypeStr);
    }
  }, [filterMode, fetchAccounts]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const cleanTypeStr = typeof filterMode === "string" ? filterMode : "ALL";
      fetchAccounts(cleanTypeStr);
      fetchCategories();
    }
  }, [filterMode, fetchAccounts, fetchCategories]);

  // form submit functionality
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!name) {
      setFormError("Please enter an account nickname.");
      return;
    }

    let finalBalance = 0;
    let finalLimit = 0;
    let due_amount = 0;

    if (type === "CREDIT CARD") {
      if (limit === "" || dueAmount === "") {
        setFormError(
          "Please populate both the fixed credit limit and current due amount inputs.",
        );
        return;
      }

      due_amount = dueAmount;
      finalLimit = parseFloat(limit);
      finalBalance = 0;
    } else {
      if (balance === "") {
        setFormError("Please enter a starting available balance amount.");
        return;
      }
      finalBalance = parseFloat(balance);
      finalLimit = 0;
      due_amount = 0;
    }

    try {
      if (editingAccount) {
        await updateAccount(
          editingAccount.id,
          name,
          type,
          finalBalance,
          finalLimit,
          due_amount,
        );
      } else {
        await createAccount(name, type, finalBalance, finalLimit, due_amount);
      }

      setName("");
      setType("BANK");
      setBalance("");
      setLimit("");
      setDueAmount("");
      setEditingAccount(null);
      setIsFormDrawerOpen(false);
    } catch (err) {}
  };

  const handleCancelEdit = () => {
    setName("");
    setType("BANK");
    setBalance("");
    setLimit("");
    setDueAmount("");
    setEditingAccount(null);
    setIsFormDrawerOpen(false);
    setFormError("");
  };

  const filteredAccounts = accounts.filter((acc) => {
    const typeName =
      acc.account_type_details?.name || acc.account_type || "BANK";
    if (filterMode === "LIQUID")
      return typeName === "BANK" || typeName === "CASH";
    if (filterMode === "CREDIT CARD") return typeName === "CREDIT CARD";
    return true;
  });

  return (
    <div
      className="w-full min-h-screen bg-[#F8FAFC] py-4 animate-fadeIn"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto space-y-6 px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
          <div className="space-y-0.5">
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              Accounts
            </h2>
            <p className="text-xs text-slate-400">
              Manage your accounts and asset pool balances.
            </p>
          </div>
          <div className="bg-indigo-100/50 border border-indigo-200/40 p-1 rounded-xl flex items-center gap-1 shadow-xs">
            <button
              type="button"
              onClick={() => setFilterMode("ALL")}
              className={`text-xs cursor-pointer font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 ${filterMode === "ALL" ? "bg-white text-indigo-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"}`}
            >
              <FiGrid /> All Accounts
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("LIQUID")}
              className={`text-xs cursor-pointer font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 ${filterMode === "LIQUID" ? "bg-white text-indigo-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"}`}
            >
              <FiActivity /> Liquid Cash
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("CREDIT CARD")}
              className={`text-xs cursor-pointer font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 ${filterMode === "CREDIT CARD" ? "bg-white text-indigo-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"}`}
            >
              <FiCreditCard /> Credit Lines
            </button>
          </div>
        </div>

        <div
          className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${editingAccount ? "border-indigo-300 ring-4 ring-indigo-500/5" : "border-indigo-200/80"}`}
        >
          <div
            onClick={() => {
              if (!editingAccount) setIsFormDrawerOpen(!isFormDrawerOpen);
            }}
            className={`p-4 flex items-center justify-between transition-colors select-none ${editingAccount ? "bg-indigo-50/40 cursor-default" : "bg-slate-50/50 hover:bg-indigo-50/20 cursor-pointer"}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${editingAccount ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600"}`}
              >
                <FiPlus className="stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  {editingAccount
                    ? `Modify Vault Parameters: ${editingAccount.name}`
                    : "Provision a fresh account balance vault node..."}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {editingAccount
                    ? "Adjust active limits or change registry balance figures."
                    : "Click to expand inputs and register new financial columns."}
                </p>
              </div>
            </div>
            {!editingAccount &&
              (isFormDrawerOpen ? (
                <FiChevronUp className="text-slate-400" />
              ) : (
                <FiChevronDown className="text-slate-400" />
              ))}
          </div>

          {isFormDrawerOpen && (
            <form
              onSubmit={(e) => {
                handleFormSubmit(e);
              }}
              className="p-6 border-t border-slate-100 bg-white space-y-4"
            >
              {(formError || financeError) && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex gap-2.5 text-xs font-medium text-rose-700">
                  <FiAlertCircle className="text-sm shrink-0 mt-0.5" />
                  <span>{formError || financeError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Vault Nickname
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bank Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5 col-span-1 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                    Classification Group
                  </label>

                  <div className="bg-slate-50 border border-slate-200 p-1 rounded-xl grid grid-cols-3 gap-1 shadow-inner">
                    {categories.map((cat) => {
                      const categoryValue = cat.name;
                      const categoryDisplayName = cat.name;
                      const isSelected = type === categoryValue;

                      return (
                        <button
                          key={categoryValue}
                          type="button"
                          disabled={!!editingAccount}
                          onClick={() => setType(categoryValue)}
                          className={`text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center transition-all duration-200 ${
                            isSelected
                              ? "bg-indigo-600 text-white shadow-sm scale-[1.01]"
                              : "text-slate-500 hover:text-slate-800 hover:bg-indigo-50/40"
                          } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                        >
                          {categoryDisplayName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {type === "CREDIT CARD" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Current Due Amount
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 text-xs font-semibold">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        disabled={!!editingAccount}
                        value={dueAmount}
                        onChange={(e) => setDueAmount(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-3.5 text-xs font-medium font-mono text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Fixed Credit Limit
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 text-xs font-semibold">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="50,000.00"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-3.5 text-xs font-medium font-mono text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Starting Available Balance
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 text-xs font-semibold">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={balance}
                      disabled={!!editingAccount}
                      onChange={(e) => setBalance(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-3.5 text-xs font-medium font-mono text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs uppercase tracking-wider h-11 px-4 rounded-xl flex items-center justify-center transition-colors duration-150 active:scale-[0.99] cursor-pointer shadow-xs"
                >
                  {editingAccount
                    ? "Apply Node Modifications"
                    : "Initialize Asset Account Node"}
                </button>
                {editingAccount && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider h-11 px-4 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <FiX /> Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {isLoading && accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner text="Syncing Network Rows..." size="md" />
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-indigo-100/60 shadow-xs text-center text-xs text-slate-400 font-medium">
            You don't have an account.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAccounts.map((accountItem) => (
              <AccountCard
                key={accountItem.id || accountItem.name}
                account={accountItem}
                onEdit={(acc) => {
                  setEditingAccount(acc);
                  setName(acc.name);
                  const currentType =
                    acc.account_type_details?.name ||
                    acc.account_type ||
                    "BANK";
                  setType(currentType);

                  if (currentType === "CREDIT CARD") {
                    setDueAmount(acc.balance || "0");
                    setLimit(acc.fixed_credit_limit || "0");
                    setBalance("");
                  } else {
                    setBalance(acc.balance || "0");
                    setDueAmount("");
                    setLimit("");
                  }
                  setIsFormDrawerOpen(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
