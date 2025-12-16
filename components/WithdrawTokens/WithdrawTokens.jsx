import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { FaWallet, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import { Header } from "../index";
import { useWeb3 } from "../../context/Web3Provider";

const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;
const BLOCKCHAIN = process.env.NEXT_PUBLIC_BLOCKCHAIN;
const OWNER_ADDRESS = process.env.NEXT_PUBLIC_OWNER_ADDRESS;
const TOKEN_ICO_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ICO_ADDRESS;
const TBC_ADDRESS = process.env.NEXT_PUBLIC_FSX_ADDRESS;
const EXPLORER_ADDRESS_URL = process.env.NEXT_PUBLIC_EXPLORER_ADDRESS_URL;

const WithdrawTokens = ({ isDarkMode }) => {
  const { tokenBalances, contract, withdrawAllTokens, globalLoad, setReCall } =
    useWeb3();

  // Theme configuration
  const theme = {
    mainBg: isDarkMode ? "bg-[#0D0B12]" : "bg-gray-100",
    cardBg: isDarkMode ? "bg-[#12101A]" : "bg-white",
    innerBg: isDarkMode ? "bg-[#1A1825]" : "bg-gray-100",
    tokenBg: isDarkMode ? "bg-[#292838]" : "bg-gray-200",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-400" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-500" : "text-gray-500",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    divide: isDarkMode ? "divide-gray-800" : "divide-gray-200",
    buttonBg: isDarkMode ? "bg-[#1A1825]" : "bg-gray-100",
    buttonHover: isDarkMode ? "hover:bg-[#20202e]" : "hover:bg-gray-200",
    warningBg: isDarkMode ? "bg-red-900/20" : "bg-red-100",
    warningText: isDarkMode ? "text-red-400" : "text-red-600",
    warningIcon: isDarkMode ? "text-red-500" : "text-red-500",
    adminBadgeBg: isDarkMode ? "bg-yellow-900/30" : "bg-yellow-100",
    adminBadgeText: isDarkMode ? "text-yellow-400" : "text-yellow-600",
    completedBg: isDarkMode ? "bg-green-900/30" : "bg-green-100",
    completedText: isDarkMode ? "text-green-400" : "text-green-600",
    arrowColor: isDarkMode ? "text-gray-600" : "text-gray-400",
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);

  // No need for token selection since withdrawAllTokens withdraws all TBC tokens
  const selectedToken = TOKEN_SYMBOL;

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "Not available";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Get token icon based on token type
  const getTokenIcon = () => {
    return (
      <span className="text-blue-500">
        <img
          src="/logo.png"
          style={{
            width: "1rem",
          }}
          alt={TOKEN_SYMBOL}
        />
      </span>
    );
  };

  // Updated handleWithdraw function to use withdrawAllTokens from contract
  const handleWithdraw = async (e) => {
    e.preventDefault();

    setIsProcessing(true);

    try {
      // Call the contract's withdrawAllTokens function
      const tx = await withdrawAllTokens();

      if (tx) {
        // Record the withdrawal with the actual amount withdrawn (if available)
        const newWithdrawal = {
          id: Date.now(),
          token: selectedToken,
          amount: tokenBalances?.tbcBalance || "Full balance",
          timestamp: new Date(),
          address: TBC_ADDRESS,
          status: "Completed",
          txHash: tx.transactionHash,
        };

        // Update state
        const updatedWithdrawals = [newWithdrawal, ...withdrawals];
        setWithdrawals(updatedWithdrawals);

        // Save to localStorage
        saveWithdrawalsToLocalStorage(updatedWithdrawals);

        // Refresh data
        setReCall((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error withdrawing tokens:", error);
      alert(`Failed to withdraw tokens: ${error.message || "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedWithdrawals = getWithdrawalsFromLocalStorage();
    if (savedWithdrawals.length > 0) {
      setWithdrawals(savedWithdrawals);
    }
  }, []);

  // Create a ref to track current withdrawals state
  const withdrawalsRef = useRef(withdrawals);

  // Update ref whenever withdrawals change
  useEffect(() => {
    withdrawalsRef.current = withdrawals;
  }, [withdrawals]);

  // Set up beforeunload event listener
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveWithdrawalsToLocalStorage(withdrawalsRef.current);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Format date for display
  const formatDate = (date) => {
    if (date instanceof Date) {
      return date.toLocaleString();
    }
    return new Date(date).toLocaleString();
  };

  // Function to save withdrawals to localStorage
  const saveWithdrawalsToLocalStorage = (withdrawals) => {
    try {
      localStorage.setItem("withdrawals", JSON.stringify(withdrawals));
      return true;
    } catch (error) {
      console.error("Error saving withdrawals to localStorage:", error);
      return false;
    }
  };

  // Function to fetch withdrawals from localStorage
  const getWithdrawalsFromLocalStorage = () => {
    try {
      const withdrawals = localStorage.getItem("withdrawals");
      return withdrawals ? JSON.parse(withdrawals) : [];
    } catch (error) {
      console.error("Error fetching withdrawals from localStorage:", error);
      return [];
    }
  };

  return (
    <>
      <Header theme={theme} title="Withdraw Tokens" />
      <div className={`${theme.mainBg} min-h-screen`}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <p className={theme.textSecondary}>
              Admin interface to withdraw all tokens from the contract to the
              owner wallet.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Withdraw Form - 3 Columns */}
            <div
              className={`lg:col-span-3 ${theme.cardBg} rounded-xl overflow-hidden shadow-lg`}
            >
              <div
                className={`p-6 border-b ${theme.border} flex justify-between items-center`}
              >
                <h2
                  className={`text-xl font-bold ${theme.text} flex items-center`}
                >
                  <FaWallet className="mr-2 text-fuchsia-500" />
                  Withdraw All Tokens
                </h2>
                <div
                  className={`px-3 py-1 ${theme.adminBadgeBg} ${theme.adminBadgeText} rounded-full text-xs font-medium`}
                >
                  Admin Only
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleWithdraw}>
                  {/* Token Info */}
                  <div className="mb-6">
                    <label className={`block ${theme.textSecondary} mb-2`}>
                      Token
                    </label>
                    <div className="py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white">
                      {getTokenIcon()}
                      <span>{TOKEN_SYMBOL}</span>
                    </div>
                  </div>

                  {/* Token Balance Card */}
                  <div className={`${theme.innerBg} rounded-xl p-4 mb-6`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={theme.textSecondary}>
                        Available Balance
                      </span>
                      <div className="flex items-center">
                        {getTokenIcon()}
                        <span className={`${theme.text} ml-2`}>
                          {TOKEN_SYMBOL}
                        </span>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${theme.text}`}>
                      {globalLoad
                        ? "Loading..."
                        : tokenBalances?.tbcBalance || "0"}{" "}
                      {TOKEN_SYMBOL}
                    </div>
                    <div className={`text-sm ${theme.textMuted} mt-1`}>
                      Token Address: {formatAddress(TBC_ADDRESS)}
                    </div>
                  </div>

                  {/* Destination */}
                  <div className={`${theme.innerBg} rounded-xl p-4 mb-6`}>
                    <div className="flex justify-between mb-1">
                      <span className={theme.textSecondary}>Destination</span>
                      <span className={theme.textSecondary}>Owner Wallet</span>
                    </div>
                    <div className="flex items-center">
                      <FaWallet className="text-fuchsia-500 mr-2" />
                      <span className={theme.text}>Contract Owner</span>
                      <FaArrowRight className={`${theme.arrowColor} mx-4`} />
                      <span
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        } text-sm`}
                      >
                        {formatAddress(OWNER_ADDRESS)}
                      </span>
                    </div>
                  </div>

                  {/* Warning */}
                  <div
                    className={`${theme.warningBg} rounded-xl p-4 mb-6 flex gap-3`}
                  >
                    <FaExclamationTriangle
                      className={`${theme.warningIcon} flex-shrink-0 mt-1`}
                    />
                    <div>
                      <p className={`${theme.warningText} font-medium`}>
                        Warning
                      </p>
                      <p className={`text-sm ${theme.textSecondary}`}>
                        This will permanently withdraw ALL tokens from the
                        contract to the owner wallet. This action cannot be
                        reversed.
                      </p>
                    </div>
                  </div>

                  {/* Withdraw Button */}
                  <button
                    type="submit"
                    disabled={
                      isProcessing ||
                      globalLoad ||
                      parseFloat(tokenBalances?.tbcBalance || 0) <= 0
                    }
                    className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-medium py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Withdraw All ${TOKEN_SYMBOL} Tokens`}
                  </button>
                </form>
              </div>
            </div>

            {/* Info & History - 2 Columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Info Card */}
              <div className={`${theme.cardBg} rounded-xl p-6 shadow-lg`}>
                <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>
                  Admin Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={theme.textSecondary}>
                      Contract Address
                    </span>
                    <span className={theme.text}>
                      {formatAddress(TOKEN_ICO_ADDRESS)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textSecondary}>Owner Address</span>
                    <span className={theme.text}>
                      {formatAddress(OWNER_ADDRESS)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textSecondary}>Network</span>
                    <span className={theme.text}>{BLOCKCHAIN}</span>
                  </div>
                </div>
              </div>

              {/* Recent Withdrawals */}
              <div
                className={`${theme.cardBg} rounded-xl overflow-hidden shadow-lg`}
              >
                <div className={`p-4 border-b ${theme.border}`}>
                  <h3 className={`text-lg font-semibold ${theme.text}`}>
                    Recent Withdrawals
                  </h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {withdrawals && withdrawals.length > 0 ? (
                    <div className={`divide-y ${theme.divide}`}>
                      {withdrawals.map((withdrawal) => (
                        <div key={withdrawal.id} className="p-4">
                          <div className="flex justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {getTokenIcon(withdrawal.token)}
                              <span className={`${theme.text} font-medium`}>
                                {withdrawal.amount} {withdrawal.token}
                              </span>
                            </div>
                            <span
                              className={`text-xs ${theme.completedBg} ${theme.completedText} px-2 py-1 rounded-full`}
                            >
                              {withdrawal.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className={theme.textSecondary}>
                              {formatDate(withdrawal.timestamp)}
                            </span>
                            <a
                              href={`${EXPLORER_ADDRESS_URL}${withdrawal.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-fuchsia-500 "
                            >
                              {formatAddress(withdrawal.address)}
                            </a>
                          </div>
                          {withdrawal.txHash && (
                            <div className="mt-1">
                              <a
                                href={`${EXPLORER_ADDRESS_URL.replace(
                                  "/address/",
                                  "/tx/"
                                )}${withdrawal.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-fuchsia-500"
                              >
                                View Transaction
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-6 text-center ${theme.textMuted}`}>
                      No recent withdrawals
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawTokens;
