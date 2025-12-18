# 🚀 DeFi ICO DApp

> **A decentralized Initial Coin Offering (ICO) platform built with Solidity, Next.js, and Web3 that enables secure token sales on Ethereum using smart contracts.**

---

## 🧠 Overview

In the evolving Web3 ecosystem, fundraising without intermediaries is critical.  
The **DeFi ICO DApp** is designed to provide a **transparent, secure, and decentralized token sale mechanism** where users can purchase ERC-20 tokens directly using **ETH**, without relying on centralized platforms.

This project leverages **Ethereum smart contracts** to manage the entire ICO lifecycle — from token pricing to distribution — while a **Next.js frontend** delivers a smooth Web3 user experience via MetaMask.

💡 **Goal:**  
To demonstrate a **real-world ICO workflow** using blockchain fundamentals such as smart contracts, wallets, transactions, and on-chain transparency.

---

## ⚙️ Tech Stack

| Layer                         | Tools / Frameworks Used                                                |
| -------------------------     | ------------------------------------------------                       |
| 🧠 **Smart Contracts**        | Solidity                                                              |
| ⚙️ **Development**            | Hardhat, Remix IDE                                                    |
| 🌐 **Frontend**               | Next.js (React), JavaScript, CSS                                      |
| 🔗 **Web3 Integration**       | Ethers.js (JavaScript-based), Web3.js, Wagmi, Web3 Provider           |
| 👛 **Wallet**                 | MetaMask (used), (Rainbow, Coinbase, Wallet Connect) (integrated)     |
| ⛓️ **Blockchain**             | Ethereum (Sepolia Testnet)                                            |
| 🚀 **Deployment**             | Vercel                                                                |
| 🤖 **Scripting & Automation** | Shell Script, Batchfile, PowerShell, VBScript (minor utility usage)   |

---

## 📦 Core Modules

### 1️⃣ **ERC-20 Token Contract**

- Implemented using **Solidity** ERC-20 standard**.
- Fixed total supply minted at deployment.
- Tokens are securely transferred to buyers via the ICO contract.
- Fully compliant with Ethereum token standards.

---

### 2️⃣ **ICO Smart Contract**

- Handles ETH-based token purchases.
- Dynamically calculates tokens based on token price and decimals.
- Transfers purchased tokens instantly to the buyer’s wallet.
- Sends received ETH directly to the contract owner.
- Prevents accidental ETH transfers using fallback protection.
- Maintains on-chain records such as total tokens sold.

---

### 3️⃣ **Transaction Handling Module**

- Each purchase triggers a blockchain transaction.
- Token transfers and ETH transfers are atomic and trustless.
- Events are emitted for transparency and tracking.
- Transaction details are reflected in the frontend UI.

---

### 4️⃣ **Frontend (Next.js Web App)**

- Built using **Next.js and React components**.
- Wallet connection handled through **MetaMask**.
- Displays:
  - Token details
  - Sale progress
  - Token price
  - Purchased amount
- Includes a token calculator for estimating returns.
- Real-time updates based on blockchain data.

---

## 🎯 Project Objectives

✅ Implement a decentralized ICO mechanism.  
✅ Eliminate third-party intermediaries in fundraising.  
✅ Ensure transparency using blockchain transactions.  
✅ Demonstrate secure ETH → Token conversion logic.  
✅ Build a production-ready Web3 frontend.

---

## 🧾 Token Details

| Attribute        | Value            |
| ---------------- | ---------------- |
| Token Name       | LINKTUM          |
| Token Symbol     | LTUM             |
| Token Standard   | ERC-20           |
| Total Supply     | 10,000,000,000   |
| Decimals         | 18               |
| Network          | Ethereum Sepolia |

---

## 🧩 How It Works

1️⃣ User connects their wallet using **MetaMask**.  
2️⃣ User enters the ETH amount to invest.  
3️⃣ Smart contract calculates token quantity using on-chain logic.  
4️⃣ ETH is transferred to the owner wallet.  
5️⃣ Tokens are transferred instantly to the user.  
6️⃣ Transaction details are permanently recorded on the blockchain.

---

## 🛠️ Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/suraktimssm/DeFi-ICO-DApp.git
cd DeFi-ICO-DApp

---

## 🛠️ Prerequisites & Setup

### Install VS Code Editor
- **Download:** https://code.visualstudio.com/download

---

### 📦 Node.js & NPM Version
- **Node.js:** v18.17.1 (LTS / Recommended)
- **NPM:** 8.19.2
- **Download:** https://nodejs.org/en/download

---


