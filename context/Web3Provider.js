import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import { useAccount, useChainId, useConnect, useBalance } from "wagmi";

// INTERNAL IMPORT
import { useToast } from "./ToastContext";
import TOKEN_ICO_ABI from "./ABI.json";
import { useEthersProvider, useEthersSigner } from "../provider/hooks";
import { config } from "../provider/wagmiConfigs";
import { handleTransactionError, erc20Abi, generateId } from "./Utility";

const TBC_ADDRESS = process.env.NEXT_PUBLIC_TBC_ADDRESS;
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const TOKEN_DECIMAL = process.env.NEXT_PUBLIC_TOKEN_DECIMAL;
const TOKEN_LOGO = process.env.NEXT_PUBLIC_TOKEN_LOGO;
const DOMAIN_URL = process.env.NEXT_PUBLIC_NEXT_DOMAIN_URL;
const PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_USD_PRICE;
const TokenICOAbi = TOKEN_ICO_ABI.abi;

// Create context
const Web3Context = createContext(null);

// Constants
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ICO_ADDRESS;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

const fallbackProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

export const Web3Provider = ({ children }) => {
  // Get toast functions
  const { notify } = useToast();
  // Wagmi hooks v2
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { balance } = useBalance({ config });
  const { connect, connectors } = useConnect();
  const [reCall, setReCall] = useState(0);
  const [globalLoad, setGlobalLoad] = useState(false);

  // Custom ethers hooks
  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const fallbackProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const [isConnecting, setIsConnecting] = useState(false);

  const [contractInfo, setContractInfo] = useState({
    tbcaddress: null,
    tbcBalance: "0",
    ethPrice: "0",
    totalSold: "0",
  });

  const [tokenBalances, setTokenBalances] = useState({
    userTbcBalance: "0",
    contractEthBalance: null,
    totalSupply: null,
    userEthBalance: null,
    ethPrice: "0",
    tbcBalance: "0",
  });
  const [error, setError] = useState(null);

  // Initialize contract when provider is available
  useEffect(() => {
    const initContract = () => {
      if (provider && signer) {
        try {
          // Create contract instance

          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESS,
            TokenICOAbi,
            signer
          );

          setContract(contractInstance);
        } catch (error) {
          console.error("Error initializing contract:", error);
          setError("Failed to initialize contract");
        }
      }
    };

    initContract();
  }, [provider, signer]);

  // Modified useEffect
  useEffect(() => {
    // Fetch contract info in an optimized way
    const fetchContractInfo = async () => {
      setGlobalLoad(false);

      try {
        // Use connected wallet or fallback
        const currentProvider = signer?.provider || provider || fallbackProvider;


        // Read-only contract instance
        const readOnlyContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          TokenICOAbi,
          currentProvider
        );

        // Fetch basic info
        const info = await readOnlyContract.getContractInfo();

        // Format token amounts correctly based on decimals
        const tokenDecimals = parseInt(info.tokenDecimals) || 18;

        // Set contract info with proper formatting
        setContractInfo({
          tbcAddress: info.tokenAddress,
          tbcBalance: ethers.utils.formatUnits(
            info.tokenBalance,
            tokenDecimals
          ),
          ethPrice: ethers.utils.formatUnits(info.ethPrice, 18),
          totalSold: ethers.utils.formatUnits(info.totalSold, tokenDecimals),
        });

        // Parallel fetching of user data if connected
        if (address && info.tokenAddress) {
          const tokenContract = new ethers.Contract(
            info.tokenAddress,
            erc20Abi,
            currentProvider
          );

          // Fetch user token balance and ETH balance in parallel
          const [
            userTokenBalance,
            userEthBalance,
            contractEthBalance,
            totalSupply,
          ] = await Promise.all([
            tokenContract.balanceOf(address),
            currentProvider.getBalance(address),
            currentProvider.getBalance(CONTRACT_ADDRESS),
            tokenContract.totalSupply(),
          ]);

          // Update token balances with all retrieved data
          setTokenBalances((prev) => ({
            ...prev,
            userTbcBalance: ethers.utils.formatUnits(
              userTokenBalance,
              tokenDecimals
            ),
            contractEthBalance: ethers.utils.formatEther(contractEthBalance),
            totalSupply: ethers.utils.formatUnits(totalSupply, tokenDecimals),
            userEthBalance: ethers.utils.formatEther(userEthBalance),
            ethPrice: ethers.utils.formatUnits(info.ethPrice, 18),
            tbcBalance: ethers.utils.formatUnits(
              info.tokenBalance,
              tokenDecimals
            ),
          }));
        }

        setGlobalLoad(false);
      } catch (error) {
        console.error("Error fetching contract info");
      }
    };

    fetchContractInfo();
  }, [contract, address, provider, signer, reCall]);

  // Buy tokens
  const buyToken = async (ethAmount) => {
    if (!contract || !address) return null;

    const toastId = notify.start(`Buying ${TOKEN_SYMBOL} with ${CURRENCY}...`);

    try {
      // Convert ETH to wei
      const ethValue = ethers.utils.parseEther(ethAmount);

      // Call the correct function from your contract
      const tx = await contract.buyToken({
        value: ethValue,
      });

      notify.update(toastId, "Processing", "Waiting for confirmation...");

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        // Calculate tokens received based on fixed price of 0.01 ETH per token
        const tokenPrice = PER_TOKEN_USD_PRICE; // Price per token in ETH
        const tokensReceived = parseFloat(ethAmount) / tokenPrice;

        // Get transaction details from event logs or receipt
        const txDetails = {
          timestamp: Date.now(),
          user: address, // Using the connected wallet address
          tokenIn: CURRENCY, // Assuming this is ETH/BNB/POL
          tokenOut: TOKEN_SYMBOL,
          amountIn: ethAmount,
          amountOut: tokensReceived.toString(), // Calculated based on fixed price
          transactionType: "BUY",
          hash: receipt.transactionHash,
        };

        // Save to localStorage
        saveTransactionToLocalStorage(txDetails);

        setReCall((prev) => prev + 1);
        notify.complete(
          toastId,
          `Successfully purchased ${TOKEN_SYMBOL} tokens!`
        );
        return receipt;
      }
    } catch (error) {
      const { message: errorMessage, code: errorCode } = handleTransactionError(
        error,
        "buying tokens"
      );

      if (errorCode === "ACTION_REJECTED") {
        notify.reject(toastId, "Transaction rejected by user");
        return null;
      }

      console.error(errorMessage);
      notify.fail(
        toastId,
        `Transaction failed. Please try again with sufficient gas.`
      );
      return null;
    }
  };

  // Helper function to save transaction to localStorage
  const saveTransactionToLocalStorage = (txData) => {
    try {
      // Get existing transactions or initialize empty array
      const existingTransactions =
        JSON.parse(localStorage.getItem("tokenTransactions")) || [];

      // Add new transaction
      existingTransactions.push(txData);

      // Save back to localStorage
      localStorage.setItem(
        "tokenTransactions",
        JSON.stringify(existingTransactions)
      );

      console.log("Transaction saved to localStorage:", txData);
    } catch (error) {
      console.error("Failed to save transaction to localStorage:", error);
    }
  };

  // Admin function: Update token price
  const updateTokenPrice = async (newPrice) => {
    if (!contract || !address) return null;

    const toastId = notify.start(`Updating token price...`);

    try {
      const parsedPrice = ethers.utils.parseEther(newPrice);
      const tx = await contract.updateTokenPrice(parsedPrice);

      notify.update(toastId, "Processing", "Confirming price update...");

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setReCall((prev) => prev + 1);
        notify.complete(
          toastId,
          `Token price updated to ${newPrice} ${CURRENCY}`
        );
        return receipt;
      }
    } catch (error) {
      const { message: errorMessage, code: errorCode } = handleTransactionError(
        error,
        "updating token price"
      );

      if (errorCode === "ACTION_REJECTED") {
        notify.reject(toastId, "Transaction rejected by user");
        return null;
      }

      console.error(errorMessage);
      notify.fail(
        toastId,
        `Price update failed. Please check your permissions.`
      );
      return null;
    }
  };

  // Admin function: Set sale token
  const setSaleToken = async (tokenAddress) => {
    if (!contract || !address) return null;

    const toastId = notify.start(`Setting sale token...`);

    try {
      const tx = await contract.setSaleToken(tokenAddress);

      notify.update(toastId, "Processing", "Confirming token update...");

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setReCall((prev) => prev + 1);
        notify.complete(toastId, `Sale token updated successfully`);
        return receipt;
      }
    } catch (error) {
      const { message: errorMessage, code: errorCode } = handleTransactionError(
        error,
        "setting sale token"
      );

      if (errorCode === "ACTION_REJECTED") {
        notify.reject(toastId, "Transaction rejected by user");
        return null;
      }

      console.error(errorMessage);
      notify.fail(
        toastId,
        `Failed to set sale token. Please check the address.`
      );
      return null;
    }
  };

  // Admin function: Withdraw all tokens
  const withdrawAllTokens = async () => {
    if (!contract || !address) return null;

    const toastId = notify.start(`Withdrawing tokens...`);

    try {
      const tx = await contract.withdrawAllTokens();

      notify.update(toastId, "Processing", "Confirming withdrawal...");

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setReCall((prev) => prev + 1);
        notify.complete(toastId, `All tokens withdrawn successfully`);
        return receipt;
      }
    } catch (error) {
      const { message: errorMessage, code: errorCode } = handleTransactionError(
        error,
        "withdrawing tokens"
      );

      if (errorCode === "ACTION_REJECTED") {
        notify.reject(toastId, "Transaction rejected by user");
        return null;
      }

      console.error(errorMessage);
      notify.fail(toastId, `Failed to withdraw tokens. Please try again.`);
      return null;
    }
  };

  // Admin function: Rescue tokens
  const rescueTokens = async (tokenAddress) => {
    if (!contract || !address) return null;

    const toastId = notify.start(`Rescuing tokens...`);

    try {
      const tx = await contract.rescueTokens(tokenAddress);

      notify.update(toastId, "Processing", "Confirming rescue operation...");

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setReCall((prev) => prev + 1);
        notify.complete(toastId, `Tokens rescued successfully`);
        return receipt;
      }
    } catch (error) {
      const { message: errorMessage, code: errorCode } = handleTransactionError(
        error,
        "rescuing tokens"
      );

      if (errorCode === "ACTION_REJECTED") {
        notify.reject(toastId, "Transaction rejected by user");
        return null;
      }

      console.error(errorMessage);
      notify.fail(
        toastId,
        `Failed to rescue tokens. Please check the address.`
      );
      return null;
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const formatTokenAmount = (amount, decimals = 18) => {
    if (!amount) return "0";
    return ethers.utils.formatUnits(amount, decimals);
  };

  // Check if connected account is the owner
  const isOwner = async () => {
    if (!contract || !address) return false;

    try {
      const ownerAddress = await contract.owner();
      return ownerAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      const errorMessage = handleTransactionError(error, "withdraw Tokens");
      console.log(errorMessage);
      // console.log(error);
      return false;
    }
  };

  const addtokenToMetaMask = async () => {
    // Start a transaction toast notification
    const toastId = notify.start(`Adding ${TOKEN_SYMBOL} Token to MetaMask`);
    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: TBC_ADDRESS,
            symbol: TOKEN_SYMBOL,
            decimals: TOKEN_DECIMAL,
            image: TOKEN_LOGO,
          },
        },
      });
      console.log(TBC_ADDRESS, TOKEN_SYMBOL, TOKEN_DECIMAL, TOKEN_LOGO);
      if (wasAdded) {
        notify.complete(toastId, `Successfully added token`);
      } else {
        notify.complete(toastId, `Failed to add the token`);
      }
    } catch (error) {
      console.log(error);
      const { message: errorMessage, code: errorCode } = handleTransactionError(
        error,
        "Token addition error"
      );
      // For other errors, show failure notification
      notify.fail(
        toastId,
        `Transaction failed: ${
          errorMessage.message === "undefined"
            ? "Not Supported"
            : errorMessage.message
        }`
      );
    }
  };

  const value = {
    provider,
    signer,
    contract,
    account: address,
    chainId,
    isConnected: !!address && !!contract,
    isConnecting,
    contractInfo,
    tokenBalances,
    error,
    reCall,
    globalLoad,
    buyToken,
    updateTokenPrice,
    setSaleToken,
    withdrawAllTokens,
    formatAddress,
    formatTokenAmount,
    isOwner,
    setReCall,
    addtokenToMetaMask,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

// Create hook for easy access to context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

export default Web3Context;
