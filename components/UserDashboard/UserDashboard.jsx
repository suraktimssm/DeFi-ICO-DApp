import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  FaWallet,
  FaHistory,
  FaExchangeAlt,
  FaCoins,
  FaEthereum,
  FaChartLine,
  FaInfoCircle,
  FaCopy,
  FaCheck,
  FaGift,
} from "react-icons/fa";
import { SiTether } from "react-icons/si";
import { useWeb3 } from "../../context/Web3Provider";
import { Header } from "../index";

const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const TOKEN_SUPPLY = process.env.NEXT_PUBLIC_TOKEN_SUPPLY;
const PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_USD_PRICE;
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;
const BLOCKCHAIN = process.env.NEXT_PUBLIC_BLOCKCHAIN;
const EXPLORER_ADDRESS_URL = process.env.NEXT_PUBLIC_EXPLORER_ADDRESS_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_NEXT_DOMAIN_URL;

const UserDashboard = ({ isDarkMode }) => {
  const {
    account,
    isConnected,
    isConnecting,
    contractInfo,
    tokenBalances,
    formatAddress,
    formatTokenAmount,
    isOwner,
  } = useWeb3();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  // Transaction history state
  const [transactions, setTransactions] = useState([]);

  const [referralInfo, setReferralInfo] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [referralTransactions, setReferralTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [referrerInput, setReferrerInput] = useState("");
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    // Load transactions from localStorage when component mounts
    const loadTransactions = () => {
      try {
        const savedTransactions = localStorage.getItem("tokenTransactions");
        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
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

  // Copy address to clipboard
  const copyAddressToClipboard = () => {
    navigator.clipboard
      .writeText(account)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy address:", err);
      });
  };

  // Format timestamp
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };
  // Format transaction hash
  const formatHash = (hash) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  // Get payment method icon
  const getPaymentIcon = (method) => {
    switch (method) {
      case "ETH":
        return (
          <img
            style={{
              width: ".9rem",
            }}
            src="/sepolia.svg"
            alt="ETH"
          />
        );
      case "USDT":
        return (
          <img
            style={{
              width: ".9rem",
            }}
            src="/usdt.svg"
            alt="usdt"
          />
        );
      case "USDC":
        return (
          <img
            src="/usdc.svg"
            style={{
              width: ".9rem",
            }}
          />
        );
      default:
        return <FaGift className="text-purple-500" />;
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaChartLine /> },
    { id: "assets", label: "Assets", icon: <FaCoins /> },
    { id: "transactions", label: "Transactions", icon: <FaHistory /> },
  ];

  // Format large numbers with K, M, B suffixes
  const formatLargeNumber = (num) => {
    if (!num) return "0";

    // Convert to number if it's a string
    const value = Number(num);

    // Handle different magnitudes
    if (value >= 1e9) {
      // Billions
      return (value / 1e9).toFixed(2) + " B";
    } else if (value >= 1e6) {
      // Millions
      return (value / 1e6).toFixed(2) + " M";
    } else if (value >= 1e3) {
      // Thousands
      return (value / 1e3).toFixed(2) + " K";
    } else {
      // Regular number
      return value.toFixed(2);
    }
  };

  const theme = {
    bg: isDarkMode ? "bg-[#0D0B12]" : "bg-gray-100",
    header: isDarkMode ? "bg-[#12101A]" : "bg-white",
    inputBg: isDarkMode ? "bg-[#1A1825]" : "bg-gray-100",
    card: isDarkMode ? "bg-[#12101A]" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-400" : "text-gray-500",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    divide: isDarkMode ? "divide-gray-800" : "divide-gray-200",
  };

  return (
    <div className={`${theme.bg} min-h-screen pb-8`}>
      <Header theme={theme} title="User Dashboard" />
      <div
        className={`${theme.header} py-4 px-4 sm:px-6 mb-6 border-b ${theme.border}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className={`text-xl sm:text-2xl font-bold ${theme.text}`}></h1>

            {/* Wallet Info */}
            <div
              className={`flex items-center ${
                isDarkMode ? "bg-[#1A1825]" : "bg-gray-100"
              } rounded-lg px-3 py-2 gap-3`}
            >
              <FaWallet className="text-fuchsia-500" />
              <span className={theme.text}>{formatAddress(account)}</span>
              <button
                onClick={copyAddressToClipboard}
                className={`${theme.textSecondary} hover:${theme.text} transition-colors`}
                title="Copy to clipboard"
              >
                {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto ">
        <div
          className={`flex overflow-x-auto scrollbar-hide border-b ${theme.border} mb-6`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white"
                  : isDarkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`${theme.card} rounded-xl p-6`}>
                    <div className="flex justify-between items-start mb-4">
                      <FaCoins className="text-fuchsia-500 text-xl" />
                      <span className={theme.textSecondary}>Total Balance</span>
                    </div>
                    <h3 className={`text-2xl font-bold ${theme.text} mb-1`}>
                      {tokenBalances?.userTbcBalance} {TOKEN_SYMBOL}
                    </h3>
                    <p className={theme.textSecondary}>
                      ≈ ${tokenBalances?.userTbcBalance * PER_TOKEN_USD_PRICE}
                    </p>
                  </div>

                  <div className={`${theme.card} rounded-xl p-6`}>
                    <div className="flex justify-between items-start mb-4">
                      <FaEthereum className="text-fuchsia-500 text-xl" />
                      <span className={theme.textSecondary}>
                        {CURRENCY} Balance
                      </span>
                    </div>
                    <h3 className={`text-2xl font-bold ${theme.text} mb-1`}>
                      {tokenBalances?.userEthBalance
                        ? parseFloat(tokenBalances.userEthBalance).toFixed(6)
                        : "0.00"}{" "}
                      {CURRENCY}
                    </h3>
                    <p className={theme.textSecondary}>≈ Your Balance</p>
                  </div>

                  <div className={`${theme.card} rounded-xl p-6`}>
                    <div className="flex justify-between items-start mb-4">
                      <FaGift className="text-fuchsia-500 text-xl" />

                      <span className={theme.textSecondary}>
                        {TOKEN_SYMBOL} Purchased
                      </span>
                    </div>
                    <h3 className={`text-2xl font-bold ${theme.text} mb-1`}>
                      {transactions?.length}
                    </h3>
                    <p className={theme.textSecondary}>
                      Total Count: {transactions?.length + 6} {TOKEN_SYMBOL}
                    </p>
                  </div>

                  <div className={`${theme.card} rounded-xl p-6`}>
                    <div className="flex justify-between items-start mb-4">
                      <FaExchangeAlt className="text-fuchsia-500 text-xl" />
                      <span className={theme.textSecondary}>Transactions</span>
                    </div>
                    <h3 className={`text-2xl font-bold ${theme.text} mb-1`}>
                      {transactions.length}
                    </h3>
                    <p className={theme.textSecondary}>
                      Last:{" "}
                      {transactions.length > 0
                        ? formatDate(transactions[0].timestamp)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className={`${theme.card} rounded-xl overflow-hidden`}>
                  <div
                    className={`px-6 py-4 border-b ${theme.border} flex justify-between items-center`}
                  >
                    <h3 className={`text-lg font-semibold ${theme.text}`}>
                      Recent Activity
                    </h3>
                    <button
                      onClick={() => setActiveTab("transactions")}
                      className="text-fuchsia-500 text-sm hover:text-purple-300"
                    >
                      View All
                    </button>
                  </div>

                  <div className={`divide-y ${theme.divide}`}>
                    {transactions.slice(0, 3).map((tx, index) => (
                      <div
                        key={index}
                        className="px-6 py-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.transactionType === "BUY"
                                ? "bg-blue-900/30"
                                : "bg-purple-900/30"
                            }`}
                          >
                            {tx.transactionType === "BUY" ? (
                              <FaExchangeAlt className="text-blue-400" />
                            ) : (
                              <FaGift className="text-fuchsia-500" />
                            )}
                          </div>
                          <div>
                            <p className={`${theme.text} font-medium`}>
                              {tx.transactionType === "BUY"
                                ? `${TOKEN_SYMBOL} Token Purchase`
                                : tx.transactionType === "REFERRAL"
                                ? "REFERRAL"
                                : "Stable Coin Purchase"}
                            </p>
                            <p className={`text-sm ${theme.textSecondary}`}>
                              {formatDate(tx.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`${theme.text} font-medium`}>
                            {tx.amountOut}{" "}
                            {tx.transactionType === "BUY"
                              ? `${TOKEN_SYMBOL}`
                              : `${tx.tokenOut}`}
                          </p>
                          {tx.transactionType === "BUY" && (
                            <p className={`text-sm ${theme.textSecondary}`}>
                              {tx.paymentAmount} {tx.paymentMethod}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {transactions.length === 0 && (
                      <div
                        className={`px-6 py-8 text-center ${theme.textSecondary}`}
                      >
                        No recent activity
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Assets Tab */}
            {activeTab === "assets" && (
              <div className="space-y-6">
                <div className={`${theme.card} rounded-xl overflow-hidden`}>
                  <div className={`px-6 py-4 border-b ${theme.border}`}>
                    <h3 className={`text-lg font-semibold ${theme.text}`}>
                      Your Assets
                    </h3>
                  </div>

                  <div className={`divide-y ${theme.divide}`}>
                    {/* Token Asset */}
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center">
                          {/* <FaCoins className="text-fuchsia-500" /> */}
                          <img
                            style={{
                              width: "3rem",
                            }}
                            src="/logo.png"
                            alt=""
                            srcset=""
                          />
                        </div>
                        <div>
                          <p className={`${theme.text} font-medium`}>
                            {TOKEN_SYMBOL}
                          </p>
                          <p className={`text-sm ${theme.textSecondary}`}>
                            {TOKEN_NAME} ({TOKEN_SYMBOL})
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`${theme.text} font-medium`}>
                          {tokenBalances?.userTbcBalance} {TOKEN_SYMBOL}
                        </p>
                        <p className={`text-sm ${theme.textSecondary}`}>
                          ≈ $
                          {Number(tokenBalances?.userTbcBalance) *
                            PER_TOKEN_USD_PRICE}
                        </p>
                      </div>
                    </div>

                    {/* ETH Asset */}
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center">
                          <img
                            style={{
                              width: "3rem",
                            }}
                            src="/sepolia.svg"
                            alt=""
                            srcset=""
                          />
                        </div>
                        <div>
                          <p className={`${theme.text} font-medium`}>
                            {CURRENCY}
                          </p>
                          <p className={`text-sm ${theme.textSecondary}`}>
                            {BLOCKCHAIN}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`${theme.text} font-medium`}>
                          {tokenBalances?.userEthBalance} {CURRENCY}
                        </p>
                        <p className={`text-sm ${theme.textSecondary}`}>
                          ≈ Your balance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Transactions Tab */}
            {activeTab === "transactions" && (
              <div className="space-y-6">
                <div className={`${theme.card} rounded-xl overflow-hidden`}>
                  <div className={`px-6 py-4 border-b ${theme.border}`}>
                    <h3 className={`text-lg font-semibold ${theme.text}`}>
                      Transaction History
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr
                          className={`border-b ${theme.border} text-left ${theme.textSecondary} text-sm`}
                        >
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Amount</th>
                          <th className="px-6 py-3">Payment</th>
                          <th className="px-6 py-3 hidden sm:table-cell">
                            Date
                          </th>
                          <th className="px-6 py-3 hidden md:table-cell">
                            Wallet
                          </th>
                          <th className="px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${theme.divide}`}>
                        {transactions.map((tx, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  tx.transactionType === "BUY"
                                    ? "bg-blue-900/30 text-blue-400"
                                    : "bg-purple-900/30 text-fuchsia-500"
                                }`}
                              >
                                {tx.transactionType}
                              </span>
                            </td>
                            <td className={`px-6 py-4 ${theme.text}`}>
                              {tx.amountOut} {TOKEN_SYMBOL}
                            </td>
                            <td className="px-6 py-4">
                              {tx.tokenIn ? (
                                <div className="flex items-center gap-1">
                                  {getPaymentIcon(tx.tokenIn)}
                                  <span className={`${theme.text} ml-1`}>
                                    {tx.amountIn} {tx.tokenIn}
                                  </span>
                                </div>
                              ) : (
                                <span className={theme.textSecondary}>-</span>
                              )}
                            </td>
                            <td
                              className={`px-6 py-4 ${theme.textSecondary} hidden sm:table-cell`}
                            >
                              {formatDate(tx.timestamp)}
                            </td>
                            <td
                              className={`px-6 py-4 ${theme.textSecondary} hidden md:table-cell`}
                            >
                              <a
                                href={`${EXPLORER_ADDRESS_URL}${tx.user}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-fuchsia-500 hover:text-purple-300"
                              >
                                {formatHash(tx.user)}
                              </a>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  isDarkMode
                                    ? "bg-green-900 text-green-400"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                Completed
                              </span>
                            </td>
                          </tr>
                        ))}

                        {transactions.length === 0 && (
                          <tr>
                            <td
                              colSpan="6"
                              className={`px-6 py-8 text-center ${theme.textSecondary}`}
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
