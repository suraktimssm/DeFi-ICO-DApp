import React, { useState } from "react";
import { utils } from "ethers";
import { BsBank2 } from "react-icons/bs";
import {
  FaDollarSign,
  FaCoins,
  FaExchangeAlt,
  FaBan,
  FaSave,
  FaCheck,
} from "react-icons/fa";
import { useWeb3 } from "../../context/Web3Provider";
import { Success, Error } from "../index";
import { Header } from "../index";

const AdminFunctions = ({ isDarkMode }) => {
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
    formatAddress,
    formatTokenAmount,
    refreshContractData,
    isOwner,
    updateBaseAPY,
    updateMinStakeAmount,
    updateStablecoinPrice,
  } = useWeb3();

  // Theme configuration
  const theme = {
    cardBg: isDarkMode ? "bg-[#12101A]" : "bg-white",
    footerBg: isDarkMode ? "bg-[#0D0B12]" : "bg-gray-50",
    inputBg: isDarkMode ? "bg-[#1A1825]" : "bg-gray-100",
    warningBg: isDarkMode ? "bg-[#1A1825]" : "bg-yellow-50",
    warningText: isDarkMode ? "text-yellow-400" : "text-yellow-600",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-400" : "text-gray-600",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    tabHover: isDarkMode
      ? "hover:bg-purple-900/10 hover:text-gray-300"
      : "hover:bg-purple-50 hover:text-gray-700",
    fieldTitle: isDarkMode
      ? "bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600"
      : "bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600",
    checkboxBg: isDarkMode ? "bg-[#1A1825]" : "bg-gray-100",
  };

  const [activeTab, setActiveTab] = useState("priceSettings");

  // Form state for each function
  const [stablecoinPrice, setStablecoinPrice] = useState("");
  const [tokenPrice, setTokenPrice] = useState("");
  const [usdtAddress, setUsdtAddress] = useState("");
  const [usdtRatio, setUsdtRatio] = useState("");
  const [usdcAddress, setUsdcAddress] = useState("");
  const [usdcRatio, setUsdcRatio] = useState("");
  const [saleTokenAddress, setSaleTokenAddress] = useState("");
  const [blockAddress, setBlockAddress] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [updateBaseAPYPercent, setUpdateBaseAPYPercent] = useState("");
  const [updateMinStake, setUpdateMinStake] = useState("");

  // Function to validate Ethereum address
  const isValidAddress = (address) => {
    return /^0x[0-9a-fA-F]{40}$/i.test(address);
  };

  // Placeholder for actual contract interactions
  const handleSubmit = async (e, functionName) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setTransactionHash("");
    try {
      if (functionName === "updateTokenPrice") {
        setIsProcessing(true);
        const response = await updateTokenPrice(tokenPrice);
        console.log(response);
        setTransactionHash(response?.transactionHash);
        setSuccessMessage(
          `Successfully transferred ${tokenPrice} Token ETH Price set to ${formatAddress(
            response?.to
          )}`
        );
        setIsProcessing(false);
      } else if (functionName === "setSaleToken") {
        setIsProcessing(true);
        const response = await setSaleToken(saleTokenAddress);
        console.log(response);
        setTransactionHash(response?.transactionHash);
        setSuccessMessage(
          `Successfully  ${formatAddress(
            saleTokenAddress
          )} Sale Token Set to ${formatAddress(response?.to)}`
        );
        setIsProcessing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetMessage = () => {
    setStablecoinPrice("");
    setTokenPrice("");
    setUsdtAddress("");
    setUsdtRatio("");
    setUsdcAddress("");
    setUsdcRatio("");
    setErrorMessage("");
    setSuccessMessage("");
    setTransactionHash("");
    setIsProcessing(false);
    setIsBlocked(false);
    setSaleTokenAddress("");
    setBlockAddress(" ");
  };

  // Tabs configuration
  const tabs = [
    { id: "priceSettings", label: "Price Settings", icon: <FaDollarSign /> },
    { id: "tokenConfig", label: "Token Config", icon: <FaCoins /> },
  ];

  return (
    <>
      <Header theme={theme} title="Admin Function" />
      <div
        className={`${theme.cardBg} ${theme.text} rounded-xl shadow-lg overflow-hidden`}
      >
        {/* Tab Navigation */}
        <div
          className={`flex flex-wrap sm:flex-nowrap border-b ${theme.border}`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => (setActiveTab(tab.id), resetMessage())}
              className={`flex items-center gap-2 px-4 py-3 flex-grow sm:flex-grow-0 transition-colors ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white"
                  : `${theme.textSecondary} ${theme.tabHover}`
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Price Settings Tab */}
          {activeTab === "priceSettings" && (
            <div className="space-y-6">
              <h2 className={`text-xl font-bold border-b ${theme.border} pb-2`}>
                Price Settings
              </h2>

              {/* Error Message */}
              {errorMessage && (
                <Success errorMessage={errorMessage} isDarkMode={isDarkMode} />
              )}

              {/* Success Message */}
              {successMessage && (
                <Success
                  successMessage={successMessage}
                  transactionHash={transactionHash}
                  isDarkMode={isDarkMode}
                />
              )}

              <form
                onSubmit={(e) => handleSubmit(e, "updateTokenPrice")}
                className="space-y-4"
              >
                <h3 className={`text-lg font-semibold ${theme.fieldTitle}`}>
                  Update Token Price
                </h3>
                <div className="space-y-2">
                  <label className={`block ${theme.textSecondary}`}>
                    New Price (in ETH)
                  </label>
                  <input
                    type="text"
                    value={tokenPrice}
                    onChange={(e) => setTokenPrice(e.target.value)}
                    placeholder="0.0"
                    className={`w-full ${theme.inputBg} rounded-lg p-3 ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-600`}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing || !tokenPrice}
                  className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white rounded-xl py-4 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Update Token Price"}
                </button>
              </form>
            </div>
          )}

          {/* Token Config Tab */}
          {activeTab === "tokenConfig" && (
            <div className="space-y-6">
              <h2 className={`text-xl font-bold border-b ${theme.border} pb-2`}>
                Token Configuration
              </h2>

              {/* Error Message */}
              {errorMessage && (
                <Success errorMessage={errorMessage} isDarkMode={isDarkMode} />
              )}

              {/* Success Message */}
              {successMessage && (
                <Success
                  successMessage={successMessage}
                  transactionHash={transactionHash}
                  isDarkMode={isDarkMode}
                />
              )}

              <form
                onSubmit={(e) => handleSubmit(e, "setSaleToken")}
                className="space-y-4"
              >
                <h3 className={`text-lg font-semibold ${theme.fieldTitle}`}>
                  Set Sale Token
                </h3>
                <div className="space-y-2">
                  <label className={`block ${theme.textSecondary}`}>
                    Token Address
                  </label>
                  <input
                    type="text"
                    value={saleTokenAddress}
                    onChange={(e) => setSaleTokenAddress(e.target.value)}
                    placeholder="0x..."
                    className={`w-full ${theme.inputBg} rounded-lg p-3 ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-600`}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing || !saleTokenAddress}
                  className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white rounded-xl py-4 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Set Sale Token"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer with status */}
        <div
          className={`${theme.footerBg} px-6 py-4 flex items-center justify-between border-t ${theme.border}`}
        >
          <div className={`${theme.textSecondary} text-sm`}>
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Connected as Admin
          </div>
          <div className={`${theme.textSecondary} text-sm`}>
            Last update: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminFunctions;

