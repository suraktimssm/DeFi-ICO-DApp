import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
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
import { useWeb3 } from "../context/Web3Provider";

import { MdDashboard } from "react-icons/md";
import { BiImport } from "react-icons/bi";
import {
  MobileHeader,
  Sidebar,
  TokenDocumentation,
  AdminDashboard,
  AdminFunctions,
  AdminOverview,
  UserDashboard,
  Dashboard,
  WithdrawTokens,
  TokenTransfer,
  ContactUs,
  WalletConnect,
  BlurOverlay,
  TokenSale,
  Transaction,
} from "../components/index";
import ImageBanner from "../components/Global/ImageBanner";

const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const TOKEN_SUPPLY = process.env.NEXT_PUBLIC_TOKEN_SUPPLY;
const PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_USD_PRICE;
const NEXT_PER_TOKEN_USD_PRICE =
  process.env.NEXT_PUBLIC_NEXT_PER_TOKEN_USD_PRICE;
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;
const BLOCKCHAIN = process.env.NEXT_PUBLIC_BLOCKCHAIN;

export default function Home() {
  const { isConnected, globalLoad } = useWeb3();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComponent, setIsComponent] = useState("Dashboard");

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-[#0D0B12]" : "bg-gray-100"
      } flex`}
    >
      <Head>
        <title>{TOKEN_NAME} - Bridging AI with Decentralization</title>
        <meta
          name={TOKEN_NAME}
          content="Revolutionizing intelligence through decentralized innovation."
        />
        <link rel="icon" href="/logo.png" />
      </Head>
      {/* Mobile Header */}
      <MobileHeader
        isDarkMode={isDarkMode}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Sidebar */}

      <Sidebar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
        setIsComponent={setIsComponent}
      />

      {/* Main Content */}

      <main
        className={`flex-1 lg:pl-8 px-4 pt-20 lg:pt-0 md:pt-0 sm:pt-0  pb-8 h-screen overflow-y-auto overflow-x-hidden ${
          isDarkMode ? "bg-[#0D0B12]" : "bg-gray-100"
        }`}
      >
        {/* Blur overlay */}
        {globalLoad && <BlurOverlay isLoading={true} isDarkMode={isDarkMode} />}
        <ImageBanner isDarkMode={isDarkMode} />
        {isConnected ? (
          <>
            {isComponent == "User Dashboard" ? (
              <UserDashboard isDarkMode={isDarkMode} />
            ) : isComponent == "Dashboard" ? (
              <Dashboard isDarkMode={isDarkMode} />
            ) : isComponent == "Token Documentation" ? (
              <TokenDocumentation isDarkMode={isDarkMode} />
            ) : isComponent == "Transaction" ? (
              <Transaction isDarkMode={isDarkMode} />
            ) : isComponent == "Admin Functions" ? (
              <AdminFunctions isDarkMode={isDarkMode} />
            ) : isComponent == "Admin Overview" ? (
              <AdminOverview isDarkMode={isDarkMode} />
            ) : isComponent == "Withdraw Tokens" ? (
              <WithdrawTokens isDarkMode={isDarkMode} />
            ) : isComponent == "Token Transfer" ? (
              <TokenTransfer isDarkMode={isDarkMode} />
            ) : isComponent == "Contact Us" ? (
              <ContactUs isDarkMode={isDarkMode} />
            ) : isComponent == "Token Sale" ? (
              <TokenSale isDarkMode={isDarkMode} />
            ) : (
              ""
            )}
          </>
        ) : (
          <WalletConnect isDarkMode={isDarkMode} />
        )}
      </main>
    </div>
  );
}
