import React, { useState, useEffect } from "react";
import {
  FaCoins,
  FaDollarSign,
  FaUsers,
  FaExchangeAlt,
  FaHistory,
  FaWallet,
  FaEthereum,
  FaSyncAlt,
} from "react-icons/fa";
import { SiTether } from "react-icons/si";
import { useWeb3 } from "../../context/Web3Provider";
import { Header } from "../index";

const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const TOKEN_SUPPLY = process.env.NEXT_PUBLIC_TOKEN_SUPPLY;
const PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_USD_PRICE;
const NEXT_PER_TOKEN_USD_PRICE =
  process.env.NEXT_PUBLIC_NEXT_PER_TOKEN_USD_PRICE;
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;
const BLOCKCHAIN = process.env.NEXT_PUBLIC_BLOCKCHAIN;
const TOKEN_ICO_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ICO_ADDRESS;
const OWNER_ADDRESS = process.env.NEXT_PUBLIC_OWNER_ADDRESS;

const AdminOverview = ({ isDarkMode }) => {
  const {
    account,
    isConnected,
    isConnecting,
    contractInfo,
    tokenBalances,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    buyWithETH,
    buyWithUSDT,
    buyWithUSDC,

    updateTokenPrice,
    updateUSDT,
    updateUSDC,
    setSaleToken,
    setBlockStatus,
    withdrawTokens,
    getUserTransactions,
    getAllTransactions,

    refreshContractData,
    isOwner,
  } = useWeb3();
  // State for contract data
  const [loading, setLoading] = useState(false);
  console.log(contractInfo);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Theme configuration
  const theme = {
    cardBg: isDarkMode ? "bg-[#12101A]" : "bg-white",
    innerBg: isDarkMode ? "bg-[#1A1825]" : "bg-gray-100",
    footerBg: isDarkMode ? "bg-[#0D0B12]" : "bg-gray-50",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-400" : "text-gray-600",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    hover: isDarkMode ? "hover:bg-gray-800/30" : "hover:bg-gray-100",
    tableBorder: isDarkMode ? "border-gray-800" : "border-gray-200",
    typeSuccess: isDarkMode
      ? "bg-green-900/30 text-green-400"
      : "bg-green-100 text-green-600",
    typeInfo: isDarkMode
      ? "bg-blue-900/30 text-blue-400"
      : "bg-blue-100 text-blue-600",
  };

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

  // Helper function to format token amounts based on decimals
  const formatTokenAmount = (amount, decimals = 18) => {
    const divisor = Math.pow(10, decimals);
    return (parseFloat(amount) / divisor).toLocaleString();
  };

  // Helper function to format addresses
  const formatAddress = (address) => {
    if (!address || address === "0x0000000000000000000000000000000000000000")
      return "ETH";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Helper function to format timestamps
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Helper function to determine token name
  const getTokenName = (address) => {
    if (!address || address === "0x0000000000000000000000000000000000000000")
      return "ETH";
    if (address === contractInfo.usdtAddress) return "USDT";
    if (address === contractInfo.usdcAddress) return "USDC";
    if (address === contractInfo.fsxAddress) return `${TOKEN_SYMBOL}`;
    return formatAddress(address);
  };

  /// Helper function to get token icon
  const getTokenIcon = (address) => {
    if (!address || address === "0x0000000000000000000000000000000000000000") {
      return (
        <img
          style={{
            width: ".9rem",
          }}
          src="/sepolia.svg"
          alt="ETH"
        />
      );
    }

    return (
      <span className="text-blue-500">
        {" "}
        <img
          src="/logo.png"
          style={{
            width: ".9rem",
          }}
        />
      </span>
    );
  };

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

  const tabs = [{ id: "overview", icon: <FaCoins />, label: "Overview" }];

  return (
    <>
      {/* Header */}
      <Header theme={theme} title="Admin" />
      <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden`}>
        <div
          className={`p-4 sm:p-6 border-b ${theme.border} flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center`}
        >
          <h1 className={`text-xl sm:text-2xl font-bold ${theme.text}`}>
            {/* Admin Contract Overview */}
          </h1>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            <FaSyncAlt />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex overflow-x-auto scrollbar-hide border-b ${theme.border}`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white"
                  : `${theme.textSecondary} ${theme.hover}`
              }`}
            >
              <span className="block">{tab.icon}</span>
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Token Address Card */}
                    <div className={`${theme.innerBg} rounded-xl p-3 sm:p-4`}>
                      <div
                        className={`flex items-center gap-2 ${theme.textSecondary} mb-2`}
                      >
                        <FaCoins className="text-fuchsia-500" />
                        <span>Sale Token</span>
                      </div>
                      <div
                        className={`${theme.text} font-bold text-sm sm:text-xl overflow-hidden text-ellipsis`}
                      >
                        {tokenBalances?.tbcBalance} {TOKEN_SYMBOL}
                      </div>
                    </div>

                    {/* Total Sold Card */}
                    <div className={`${theme.innerBg} rounded-xl p-3 sm:p-4`}>
                      <div
                        className={`flex items-center gap-2 ${theme.textSecondary} mb-2`}
                      >
                        <FaExchangeAlt className="text-fuchsia-500" />
                        <span>Total Tokens Sold</span>
                      </div>
                      <div
                        className={`${theme.text} font-bold text-lg sm:text-xl`}
                      >
                        {formatLargeNumber(contractInfo.totalSold)}{" "}
                        {TOKEN_SYMBOL}
                      </div>
                    </div>

                    {/* CONTRACT Address Card */}
                    <div className={`${theme.innerBg}  rounded-xl p-3 sm:p-4`}>
                      <div
                        className={`flex items-center gap-2 ${theme.textSecondary} mb-2`}
                      >
                        {" "}
                        <FaCoins className="text-fuchsia-500" />
                        <span>Contract Address</span>
                      </div>
                      <div
                        className={`${theme.text} font-bold text-sm sm:text-xl overflow-hidden text-ellipsis`}
                      >
                        {formatAddress(TOKEN_ICO_ADDRESS)}
                      </div>
                    </div>
                    {/* CONTRACT Address Card */}
                    <div className={`${theme.innerBg} rounded-xl p-3 sm:p-4`}>
                      <div
                        className={`flex items-center gap-2 ${theme.textSecondary} mb-2`}
                      >
                        {" "}
                        <FaCoins className="text-fuchsia-500" />
                        <span>Admin Address</span>
                      </div>
                      <div
                        className={`${theme.text} font-bold text-sm sm:text-xl overflow-hidden text-ellipsis`}
                      >
                        {formatAddress(OWNER_ADDRESS)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Prices & Ratios Tab */}
              {activeTab === "prices" && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Token Prices */}
                    <div className={`${theme.innerBg} rounded-xl p-4 sm:p-6`}>
                      <h2
                        className={`text-lg sm:text-xl font-bold ${theme.text} mb-3 sm:mb-4`}
                      >
                        Token Prices
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className={`${theme.textSecondary} mb-2`}>
                            Token Price ({CURRENCY})
                          </h3>
                          <p
                            className={`${theme.text} font-bold text-lg sm:text-xl`}
                          >
                            {contractInfo.ethPrice} {CURRENCY}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-gray-400 mb-2">
                            Stablecoin Price ({CURRENCY})
                          </h3>
                          <p className="text-white font-bold text-lg sm:text-xl">
                            {contractInfo.stablecoinPrice} &nbsp;
                            {CURRENCY}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Token Ratios */}
                    <div className={`${theme.innerBg} rounded-xl p-4 sm:p-6`}>
                      <h2
                        className={`text-lg sm:text-xl font-bold ${theme.text} mb-3 sm:mb-4`}
                      >
                        Token Ratios
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className={`${theme.textSecondary} mb-2`}>
                            USDT to Token Ratio
                          </h3>
                          <p
                            className={`${theme.text} font-bold text-lg sm:text-xl`}
                          >
                            1 USDT = {contractInfo.usdtTokenRatio} Tokens
                          </p>
                        </div>
                        <div>
                          <h3 className={`${theme.textSecondary} mb-2`}>
                            USDC to Token Ratio
                          </h3>
                          <p
                            className={`${theme.text} font-bold text-lg sm:text-xl`}
                          >
                            1 USDC = {contractInfo.usdcTokenRatio} Tokens
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer with status */}
        <div
          className={`${theme.footerBg} px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 border-t ${theme.border}`}
        >
          <div className={`${theme.textSecondary} text-xs sm:text-sm`}>
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Connected to contract
          </div>
          <div className={`${theme.textSecondary} text-xs sm:text-sm`}>
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOverview;
