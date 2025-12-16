import React, { useState, useEffect } from "react";
import {
  FaEthereum,
  FaInfoCircle,
  FaChartBar,
  FaExchangeAlt,
  FaHistory,
} from "react-icons/fa";
import { SiTether } from "react-icons/si";
import { TokenCalculator, CustomConnectButton } from "../index";
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
//
const TokenSale = ({ isDarkMode }) => {
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
    buyToken,
    reCall,
    formatAddress,
    formatTokenAmount,
    refreshContractData,
    isOwner,
  } = useWeb3();

  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("buyToken");
  const [ethAmount, setEthAmount] = useState("");
  const [usdtAmount, setUsdtAmount] = useState("");
  const [usdcAmount, setUsdcAmount] = useState("");
  const [calculatedTokens, setCalculatedTokens] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [percentage, setPercentage] = useState(0);

  // Theme configuration
  const theme = {
    bg: isDarkMode ? "bg-[#12101A]" : "bg-white",
    inputBg: isDarkMode ? "bg-[#1A1825]" : "bg-gray-100",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-400" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-500" : "text-gray-500",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    hover: isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100",
    progressBg: isDarkMode ? "bg-gray-800" : "bg-gray-300",
    cardBg: isDarkMode ? "bg-[#1A1825]" : "bg-gray-100",
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

  useEffect(() => {
    if (
      contractInfo &&
      "tbcBalance" in contractInfo &&
      "totalSold" in contractInfo
    ) {
      console.log("Using contract info for calculation");
      const supply = Number(contractInfo.tbcBalance);
      const sold = Number(contractInfo.totalSold);

      if (supply > 0) {
        const calculatedPercentage = Math.min(100, (sold / supply) * 100);
        console.log("Percentage from contract:", calculatedPercentage);
        console.log(calculatedPercentage);
        setPercentage(calculatedPercentage);
      }
    }
  }, [contractInfo]);

  /// Calculate tokens based on input and payment method
  useEffect(() => {
    if (activeTab === "buyToken" && ethAmount) {
      const tokens = parseFloat(ethAmount) / parseFloat(contractInfo.ethPrice);
      setCalculatedTokens(tokens.toLocaleString());
    }
  }, [activeTab, ethAmount]);

  // Function to handle token purchase
  const handlePurchase = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real implementation, you would call contract methods:
    if (activeTab === "buyToken") {
      const transaction = await buyToken(ethAmount);
      console.log(transaction);
    }

    if (activeTab === "buyToken") setEthAmount("");

    setIsLoading(false);
  };

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

  // Calculate progress percentage based on sold tokens vs total supply
  const calculateProgressPercentage = () => {
    if (!contractInfo?.totalSold || !contractInfo?.tbcBalance) return 0;

    const availbleSupply =
      Number(contractInfo?.totalSold) + Number(contractInfo?.tbcBalance);

    const soldAmount = parseFloat(contractInfo.totalSold) || 0;
    const totalSupply = parseFloat(availbleSupply) || 1; // Prevent division by zero

    // Calculate percentage with a maximum of 100%
    const percentage = Math.min((soldAmount / totalSupply) * 100, 100);

    console.log(percentage);

    // Return percentage with maximum 2 decimal places
    return parseFloat(percentage.toFixed(2));
  };

  return (
    <>
      <Header theme={theme} title="Token Sale" />
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Token Stats Card */}
          <div className="lg:col-span-1">
            <div className={`${theme.bg} rounded-xl overflow-hidden shadow-lg`}>
              <div className={`p-6 border-b ${theme.border}`}>
                <h2
                  className={`text-xl font-bold ${theme.text} flex items-center`}
                >
                  <FaChartBar className="mr-2 text-fuchsia-500" />
                  Token Stats
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Token Info */}
                <div>
                  <h3 className="text-lg font-medium text-fuchsia-500 mb-3">
                    Token Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>Name:</span>
                      <span className={theme.text}>{TOKEN_NAME}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>Symbol:</span>
                      <span className={theme.text}>{TOKEN_SYMBOL}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>Total Supply:</span>
                      <span className={theme.text}>
                        {formatLargeNumber(tokenBalances?.tbcSupply)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>
                        ICO Sale Supply:
                      </span>
                      <span className={theme.text}>
                        {formatLargeNumber(
                          Number(contractInfo?.tbcBalance) +
                            Number(contractInfo?.totalSold)
                        )}
                        &nbsp; {TOKEN_SYMBOL}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sale Progress */}
                <div>
                  <h3 className="text-lg font-medium text-fuchsia-500 mb-3">
                    Sale Progress
                  </h3>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className={theme.textSecondary}>Stage 1</span>
                      <span className={theme.text}>
                        {calculateProgressPercentage()}%
                      </span>
                    </div>
                    <div
                      className={`w-full ${theme.progressBg} rounded-full h-4`}
                    >
                      <div
                        className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 h-4 rounded-full"
                        style={{
                          width: `${calculateProgressPercentage()}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>
                        Current Price:
                      </span>
                      <span className={theme.text}>${PER_TOKEN_USD_PRICE}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>Next Price:</span>
                      <span className={theme.text}>
                        ${NEXT_PER_TOKEN_USD_PRICE}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>Total Raised:</span>
                      <span className={theme.text}>
                        ${Number(contractInfo?.totalSold) * PER_TOKEN_USD_PRICE}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>Tokens Sold:</span>
                      <span className={theme.text}>
                        {contractInfo?.totalSold}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textSecondary}>
                        Remaining Tokens:
                      </span>
                      <span className={theme.text}>
                        {Number(contractInfo?.tbcBalance) +
                          Number(contractInfo?.totalSold) -
                          Number(contractInfo?.totalSold)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Token Calculator */}
                <TokenCalculator
                  isDarkMode={isDarkMode}
                  contractInfo={contractInfo}
                />
              </div>
            </div>
          </div>

          {/* Purchase Card */}
          <div className="lg:col-span-2">
            <div className={`${theme.bg} rounded-xl overflow-hidden shadow-lg`}>
              <div className={`p-6 border-b ${theme.border}`}>
                <h2
                  className={`text-xl font-bold ${theme.text} flex items-center`}
                >
                  <FaExchangeAlt className="mr-2 text-fuchsia-500" />
                  Purchase Tokens
                </h2>
              </div>

              {/* /Payment Method Tabs */}
              <div className={`flex border-b ${theme.border}`}>
                <button
                  onClick={() => setActiveTab("buyToken")}
                  className={`flex-1 py-4 px-6 flex justify-center items-center gap-2 ${
                    activeTab === "buyToken"
                      ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white"
                      : `${theme.textSecondary} ${theme.hover}`
                  }`}
                >
                  <img
                    className={`mr-2 w-4 h-4 `}
                    src="/sepolia.svg"
                    alt="ETH"
                  />
                  <span>Pay With {CURRENCY}</span>
                </button>
              </div>

              {/* Purchase Form */}
              <div className="p-6">
                {!isConnected ? (
                  <div className="text-center py-8">
                    <p className={`${theme.textSecondary} mb-6`}>
                      Connect your wallet to purchase tokens
                    </p>

                    <button
                      onClick={connectWallet}
                      disabled={isLoading}
                      className="font-medium py-3 rounded-xl transition-colors"
                    >
                      <CustomConnectButton isDarkMode={isDarkMode} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePurchase} className="space-y-6">
                    {/* ETH Purchase Form */}
                    {activeTab === "buyToken" && (
                      <div>
                        <label className={`block ${theme.textSecondary} mb-2`}>
                          {CURRENCY} Amount
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={ethAmount}
                            onChange={(e) => setEthAmount(e.target.value)}
                            placeholder="0.0"
                            step="0.01"
                            min="0"
                            className={`w-full ${theme.inputBg} rounded-lg p-4 ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-600 pr-16`}
                            required
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <img
                              className={`mr-2 w-4 h-4 `}
                              src="/sepolia.svg"
                              alt="ETH"
                            />
                            <span className={theme.textSecondary}>
                              {CURRENCY}
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm ${theme.textMuted} mt-2`}>
                          1 {CURRENCY} ={" "}
                          {(
                            1 / parseFloat(Number(contractInfo?.ethPrice) || 1)
                          ).toLocaleString()}{" "}
                          {TOKEN_SYMBOL}
                        </p>
                      </div>
                    )}

                    {/* Token Calculation */}
                    <div className={`${theme.cardBg} rounded-lg p-4`}>
                      <div className="flex justify-between">
                        <span className={theme.textSecondary}>
                          You will receive:
                        </span>
                        <span className={`${theme.text} font-medium`}>
                          {calculatedTokens} {TOKEN_SYMBOL}
                        </span>
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <button
                      type="submit"
                      disabled={
                        isLoading ||
                        parseFloat(tokenBalances?.tbcBalance || 0) < 20
                      }
                      className={`w-full ${
                        parseFloat(tokenBalances?.tbcBalance || 0) < 20
                          ? isDarkMode
                            ? "bg-gray-700 cursor-not-allowed"
                            : "bg-gray-300 cursor-not-allowed text-gray-500"
                          : "bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700"
                      } text-white font-medium py-4 rounded-lg transition-colors`}
                    >
                      {isLoading
                        ? "Processing..."
                        : parseFloat(tokenBalances?.tbcBalance || 0) < 20
                        ? "Insufficient Token Supply"
                        : `Buy with ${
                            activeTab === "buyToken"
                              ? "ETH"
                              : activeTab === "buyWithUSDT"
                              ? "USDT"
                              : "USDC"
                          }`}
                    </button>
                  </form>
                )}

                {/* Information Notice */}
                <div
                  className={`mt-8 p-4 ${theme.cardBg} rounded-lg flex gap-3`}
                >
                  <FaInfoCircle className="text-blue-400 flex-shrink-0 mt-1" />
                  <p className={`text-sm ${theme.textSecondary}`}>
                    Token purchases are final and cannot be refunded. Make sure
                    you have connected the correct wallet address. The tokens
                    will be sent to your wallet after the transaction is
                    confirmed.
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction History (Additional) */}
            <div
              className={`mt-6 ${theme.bg} rounded-xl overflow-hidden shadow-lg`}
            >
              <div
                className={`p-6 border-b ${theme.border} flex justify-between items-center`}
              >
                <h2
                  className={`text-xl font-bold ${theme.text} flex items-center`}
                >
                  <FaHistory className="mr-2 text-fuchsia-500" />
                  Recent Transactions
                </h2>
                <button className="text-fuchsia-500 text-sm hover:text-purple-300">
                  View All
                </button>
              </div>

              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className={`border-b ${theme.border} text-left ${theme.textSecondary}`}
                      >
                        <th className="py-3 px-4 whitespace-nowrap">Date</th>
                        <th className="py-3 px-4 whitespace-nowrap">Type</th>
                        <th className="py-3 px-4 whitespace-nowrap">Amount</th>
                        <th className="py-3 px-4 whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions &&
                        transactions.slice(0, 3).map((tx, index) => (
                          <tr
                            key={index}
                            className={`border-b ${theme.border} ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <td className="py-3 px-4 whitespace-nowrap">
                              2024-02-25 10:30
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="flex items-center">
                                {tx.tokenIn === "ETH" ? (
                                  <>
                                    <img
                                      className={`mr-2 w-4 h-4 `}
                                      src="/sepolia.svg"
                                      alt="ETH"
                                    />
                                    {tx.tokenIn} Purchase
                                  </>
                                ) : tx.tokenIn === "USDT" ? (
                                  <>
                                    <SiTether className="mr-2 text-green-500" />
                                    USDT Purchase
                                  </>
                                ) : (
                                  <>
                                    <span className="mr-2 text-blue-500 font-bold">
                                      <img
                                        src="/usdc.svg"
                                        style={{
                                          width: "1rem",
                                        }}
                                      />
                                    </span>
                                    USDC Purchase
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              {tx.amountOut} {TOKEN_SYMBOL}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
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
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenSale;
