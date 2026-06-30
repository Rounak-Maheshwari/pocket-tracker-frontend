import React, { createContext, useContext, useState, useCallback } from "react";

const AccountContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AccountProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [financeError, setFinanceError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [transactionType, setTransactionType] = useState([]);
  const [predefinedCategories, setPredefinedCategories] = useState([]);

  // fetch account categories
  const fetchCategories = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/finance/list-account-categories/`,
        {
          method: "GET", // Leveraging HTTP OPTIONS metadata engine
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setCategories([...data]);
      }
    } catch (err) {
      console.warn(
        "Failed to dynamically extract metadata account categories:",
        err.message,
      );
    }
  }, []);

  const fetchAccounts = useCallback(async (accountType = "") => {
    setIsLoading(true);
    setFinanceError(null);
    const token = localStorage.getItem("access_token");

    let url = `${API_BASE_URL}/api/finance/list-create-account/`;
    const isString = typeof accountType === "string";
    const isRealType =
      isString &&
      accountType !== "" &&
      accountType !== "ALL" &&
      !accountType.includes("[object");

    if (accountType && isRealType) {
      url += `?type=${accountType}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setAccounts([]);
        setFinanceError("Session clearance expired. Please sign in again.");
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to synchronize multi-account registry data rows.",
        );
      }

      const data = await response.json();
      setAccounts(data);
      setIsLoading(false);
    } catch (err) {
      setFinanceError(err.message);
      setIsLoading(false);
    }
  }, []);

  // fetching transactions
  const fetchTransactions = useCallback(async (month, year) => {
    setIsLoading(true);
    setFinanceError(null);
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/finance/transaction/list-create/?month=${month}&year=${year}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setTransactions(data);
      setIsLoading(false);
    } catch (err) {
      setFinanceError(err.message);
      setIsLoading(false);
    }
  }, []);

  const fetchTransactionType = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/finance/transaction/transaction-types/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setTransactionType(data || []);
      }
    } catch (err) {
      console.warn(
        "Network categories fetch failed, loading local strict fallback models:",
        err.message,
      );
    }
  }, []);

  // transaction categories

  const loadDynamicCategories = useCallback(async (selectedType) => {
    const token = localStorage.getItem("access_token");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/finance/transaction/transaction-category/?type=${selectedType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setPredefinedCategories(data || []);
      }
    } catch (err) {
      console.warn(
        "Network categories fetch failed, loading local strict fallback models:",
        err.message,
      );
      if (selectedType === "EXPENSE") {
        setPredefinedCategories([
          "Groceries",
          "Food & Dining",
          "Rent & Utilities",
          "Entertainment",
          "Transport",
        ]);
      } else if (selectedType === "INCOME") {
        setPredefinedCategories([
          "Salary Invoice",
          "Dividends Dividends",
          "Freelance Work",
          "Investment Return",
        ]);
      } else {
        setPredefinedCategories([
          "Liquidation Transfer",
          "Vault Rebalancing",
          "Emergency Buffer",
        ]);
      }
    }
  }, []);

  // updating the account

  const updateAccount = async (
    accountId,
    accountName,
    accountType,
    currentBalance = 0,
    creditLimit = 0,
    due_amount = 0,
  ) => {
    setIsLoading(true);
    setFinanceError(null);
    const token = localStorage.getItem("access_token");

    let accountTypeId = null;
    if (accountType === "CREDIT CARD") {
      accountTypeId = 1;
    } else if (accountType === "BANK") {
      accountTypeId = 2;
    } else if (accountType === "CASH") {
      accountTypeId = 4;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/finance/update-delete-account/${accountId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: accountName,
            account_type: accountTypeId, // Will pass "BANK", "CASH", or "CREDIT CARD"
            balance: currentBalance,
            fixed_credit_limit: creditLimit,
            due_amount: due_amount,
          }),
        },
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.detail || "Failed to apply modifications to account node.",
        );
      }

      setIsLoading(false);
      await fetchAccounts();
      return true;
    } catch (err) {
      setFinanceError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // creating an account functionality call.
  const createAccount = async (
    accountName,
    accountType,
    initialBalance = 0,
    creditLimit = 0,
    due_amount = 0,
  ) => {
    let accountTypeId = null;
    if (accountType === "CREDIT CARD") {
      accountTypeId = 1;
    } else if (accountType === "BANK") {
      accountTypeId = 2;
    } else if (accountType === "CASH") {
      accountTypeId = 4;
    }
    setIsLoading(true);
    setFinanceError(null);
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/finance/list-create-account/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: accountName,
            account_type: accountTypeId,
            balance: initialBalance,
            fixed_credit_limit: creditLimit,
            due_amount: due_amount,
          }),
        },
      );
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.detail || "Failed to initialize new asset vault block.",
        );
      }
      setIsLoading(false);
      await fetchAccounts();
      return true;
    } catch (err) {
      setFinanceError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const deleteAccount = async (accountId) => {
    setIsLoading(true);
    setFinanceError(null);

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/finance/update-delete-account/${accountId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        throw new Error("Session clearance unauthorized.");
      }

      if (!response.ok) {
        throw new Error("Failed to execute database account node erasure.");
      }

      setIsLoading(false);
      await fetchAccounts(); // 🌟 Instantly pull fresh numbers to refresh the remaining cards on screen!
      return true;
    } catch (err) {
      setFinanceError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const logTransaction = async (
    amount,
    type,
    categoryId,
    fromAccount,
    toAccount,
    date,
    notes,
  ) => {
    setIsLoading(true);
    setFinanceError(null);
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/finance/transaction/list-create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: amount,
            transaction_type: type,
            category: categoryId,
            from_account: fromAccount,
            to_account: toAccount,
            event_date: date,
            note: notes,
          }),
        },
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to record transaction log.");
      }

      setIsLoading(false);
      await fetchAccounts();
      return true;
    } catch (err) {
      setFinanceError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const deleteTransaction = async (
    transactionId,
    currentMonth,
    currentYear,
  ) => {
    setIsLoading(true);
    setFinanceError(null);
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/finance/transaction/update-delete/${transactionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to execute ledger deletion operation.");
      }

      setIsLoading(false);
      await fetchAccounts();
      await fetchTransactions(currentMonth, currentYear);
      return true;
    } catch (err) {
      setFinanceError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  return (
    <AccountContext.Provider
      value={{
        accounts,
        transactions,
        dashboardMetrics,
        isLoading,
        financeError,
        fetchAccounts,
        createAccount,
        deleteAccount,
        fetchTransactions,
        logTransaction,
        deleteTransaction,
        setFinanceError,
        updateAccount,
        fetchCategories,
        categories,
        loadDynamicCategories,
        predefinedCategories,
        transactionType,
        fetchTransactionType,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
export const useFinance = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error(
      "useFinance must be deployed within an AccountProvider container.",
    );
  }
  return context;
};
