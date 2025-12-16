import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaMoon,
  FaSun,
  FaTwitter,
  FaDatabase,
  FaGift,
  FaDollarSign,
  FaLayerGroup,
  FaBroadcastTower,
  FaTint,
  FaMedal,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaClock,
  FaWallet,
  FaCheckCircle,
  FaArrowUp,
} from "react-icons/fa";

import { MdDashboard } from "react-icons/md";
import { BiImport } from "react-icons/bi";
import { useWeb3 } from "../../context/Web3Provider";
import { Header } from "../index";

const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const TOKEN_SUPPLY = process.env.NEXT_PUBLIC_TOKEN_SUPPLY;
const PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_USD_PRICE;
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;
const EXPLORER_ADDRESS_URL = process.env.NEXT_PUBLIC_EXPLORER_ADDRESS_URL;

const Transaction = ({ isDarkMode }) => {
  const {
    provider,
    signer,
    contract,
    account,
    chainId,
    isConnected,
    isConnecting,
    contractInfo,
    tokenBalances,
    error,

    formatAddress,
    formatTokenAmount,
    refreshContractData,
    isOwner,
  } = useWeb3();
  const [allTransaction, setAllTransaction] = useState([]);

  useEffect(() => {
    // Load transactions from localStorage when component mounts
    const loadTransactions = () => {
      try {
        const savedTransactions = localStorage.getItem("tokenTransactions");
        if (savedTransactions) {
          setAllTransaction(JSON.parse(savedTransactions));
        }
      } catch (error) {
        console.error("Error loading transactions:", error);
      }
    };

    loadTransactions();

    // Optional: Set up an event listener to update in real-time
    window.addEventListener("storage", loadTransactions);

    return () => {
      window.removeEventListener("storage", loadTransactions);
    };
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);

    // Format: YYYY-MM-DD HH:mm:ss
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const formatHash = (hash) => {
    if (!hash) return "";
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const formatAmount = (amount) => {
    if (!amount) return "0";
    return parseFloat(amount).toFixed(2);
  };

  // Theme configuration
  const theme = {
    bg: isDarkMode ? "bg-[#0D0B12]" : "bg-gray-100",
    header: isDarkMode ? "bg-[#12101A]" : "bg-white",
    card: isDarkMode ? "bg-[#12101A]" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-400" : "text-gray-500",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    divide: isDarkMode ? "divide-gray-800" : "divide-gray-200",
    shadow: isDarkMode ? "" : "shadow-lg",
  };
  return (
    <div className="max-w-7xl mx-auto">
      <Header theme={theme} title="Transaction" />
      {/* Transaction  */}

      <div
        className={`rounded-xl overflow-hidden ${theme.card} ${theme.shadow}`}
      >
        {/* Header - Made more responsive */}
        <div className="p-4 sm:p-6 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-3">
              <div className="text-fuchsia-500">
                <FaDollarSign className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h3
                  className={`text-xl sm:text-2xl font-semibold ${theme.text}`}
                >
                  Purchase History
                </h3>
                <p className={theme.textSecondary + " text-xs sm:text-sm"}>
                  (Showing {allTransaction.length} of {allTransaction.length}{" "}
                  records)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View for Referral History */}
        <div className="block sm:hidden">
          {allTransaction.length > 0 ? (
            allTransaction
              .map((transaction, index) => (
                <div key={index} className={`p-4 border-b ${theme.border}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-fuchsia-500 break-all">
                      {formatHash(transaction.user)}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        isDarkMode
                          ? "bg-green-900 text-green-400"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      Completed
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className={theme.text + " font-medium"}>
                      {formatAmount(transaction.amountOut)} {TOKEN_SYMBOL}
                    </div>
                    <div className={theme.textSecondary + " text-sm"}>
                      {formatTimestamp(transaction.timestamp)}
                    </div>
                  </div>
                </div>
              ))
              .slice(0, 20)
          ) : (
            <div className={`text-center py-8 ${theme.textSecondary}`}>
              No transactions found
            </div>
          )}
        </div>

        {/* Desktop View for Referral History */}
        <div className="hidden sm:block overflow-x-auto w-full">
          <table className="w-full min-w-[768px]">
            <thead>
              <tr className={`border-b ${theme.border}`}>
                <th
                  className={`text-left p-6 pl-6 ${theme.textSecondary} font-normal text-sm whitespace-nowrap`}
                >
                  <div className="flex items-center gap-2">
                    <FaWallet className="w-4 h-4" />
                    WALLET
                  </div>
                </th>
                <th
                  className={`text-left p-6 ${theme.textSecondary} font-normal text-sm whitespace-nowrap`}
                >
                  <div className="flex items-center gap-2">
                    <FaDollarSign className="w-4 h-4" />
                    PAYMENT
                  </div>
                </th>
                <th
                  className={`text-left p-6 ${theme.textSecondary} font-normal text-sm whitespace-nowrap`}
                >
                  <div className="flex items-center gap-2">
                    <FaDollarSign className="w-4 h-4" />
                    BOUGHT AMOUNT
                  </div>
                </th>

                <th
                  className={`text-left p-6 ${theme.textSecondary} font-normal text-sm whitespace-nowrap`}
                >
                  <div className="flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    TIME & DATE
                  </div>
                </th>
                <th
                  className={`text-left p-6 ${theme.textSecondary} font-normal text-sm whitespace-nowrap`}
                >
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="w-4 h-4" />
                    STATUS
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {allTransaction.length > 0 ? (
                allTransaction
                  .map((transaction, index) => (
                    <tr key={index} className={`border-b ${theme.border}`}>
                      <td className="p-6 pl-6 text-fuchsia-500">
                        {formatHash(transaction.user)}
                      </td>
                      <td className={`p-6 ${theme.text}`}>
                        {transaction?.amountIn} {transaction.tokenIn}
                      </td>
                      <td className={`p-6 ${theme.text}`}>
                        {formatAmount(transaction.amountOut)} {TOKEN_SYMBOL}
                      </td>
                      <td className={`p-6 ${theme.textSecondary}`}>
                        {formatTimestamp(transaction.timestamp)}
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            isDarkMode
                              ? "bg-green-900 text-green-400"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))
                  .slice(0, 20)
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className={`text-center py-12 ${theme.textSecondary}`}
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
