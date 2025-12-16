const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const network = await hre.ethers.provider.getNetwork();
  console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`);

  // TOKEN ICO CONTRACT
  if (network.chainId === 11155111) {
    console.log("\n🚀 Deploying TokenICO contract...");
    const TokenICO = await hre.ethers.getContractFactory("TokenICO");
    const tokenICO = await TokenICO.deploy();

    await tokenICO.deployed(); // ✅ Ethers v5 syntax
    const tokenICOAddress = tokenICO.address;

    console.log("\n✅ TokenICO Deployment Successful!");
    console.log("------------------------");
    console.log("NEXT_PUBLIC_TOKEN_ICO_ADDRESS:", tokenICOAddress);
    console.log("NEXT_PUBLIC_OWNER_ADDRESS:", deployer.address);
  }

  // TOKEN CONTRACT
  if (network.chainId === 11155111) {
    console.log("\n🚀 Deploying LINKTUM token contract...");
    const LINKTUM = await hre.ethers.getContractFactory("LINKTUM");
    const linktum = await LINKTUM.deploy();

    await linktum.deployed(); // ✅ Ethers v5 syntax
    const linktumAddress = linktum.address;

    console.log("\n✅ LINKTUM Token Deployment Successful!");
    console.log("------------------------");
    console.log("NEXT_PUBLIC_LINKTUM_ADDRESS:", linktumAddress);
    console.log("NEXT_PUBLIC_OWNER_ADDRESS:", deployer.address);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
