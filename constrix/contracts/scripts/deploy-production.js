const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Constrix contracts to Verychain...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "VERY");

  // Deploy ConsistencyNFT first
  console.log("\n📜 Deploying ConsistencyNFT...");
  const ConsistencyNFT = await ethers.getContractFactory("ConsistencyNFT");
  const consistencyNFT = await ConsistencyNFT.deploy(
    "Constrix Consistency Badge",
    "CCB",
    "https://api.constrix.app/metadata/"
  );
  await consistencyNFT.deployed();
  const nftAddress = consistencyNFT.address;
  console.log("✅ ConsistencyNFT deployed to:", nftAddress);

  // Deploy HabitVault
  console.log("\n🏦 Deploying HabitVault...");
  const veryTokenAddress = process.env.VERY_TOKEN_ADDRESS;
  if (!veryTokenAddress) {
    throw new Error("VERY_TOKEN_ADDRESS not set in environment");
  }

  const HabitVault = await ethers.getContractFactory("HabitVault");
  const habitVault = await HabitVault.deploy(veryTokenAddress, nftAddress);
  await habitVault.deployed();
  const vaultAddress = habitVault.address;
  console.log("✅ HabitVault deployed to:", vaultAddress);

  // Authorize HabitVault to mint NFTs
  console.log("\n🔐 Authorizing HabitVault as NFT minter...");
  await consistencyNFT.authorizeMinter(vaultAddress, true);
  console.log("✅ HabitVault authorized to mint NFTs");

  // Authorize backend to record milestones
  const backendAddress = process.env.BACKEND_ADDRESS;
  if (backendAddress) {
    console.log("\n🔐 Authorizing backend address...");
    await habitVault.authorizeBackend(backendAddress, true);
    console.log("✅ Backend authorized:", backendAddress);
  }

  console.log("\n🎉 Deployment Complete!");
  console.log("=====================================");
  console.log("ConsistencyNFT:", nftAddress);
  console.log("HabitVault:", vaultAddress);
  console.log("VERY Token:", veryTokenAddress);
  console.log("=====================================");
  
  console.log("\n📝 Update your environment variables:");
  console.log(`HABIT_VAULT_ADDRESS=${vaultAddress}`);
  console.log(`CONSISTENCY_NFT_ADDRESS=${nftAddress}`);
  console.log(`VERY_TOKEN_ADDRESS=${veryTokenAddress}`);

  // Verify contracts on explorer
  console.log("\n🔍 Verify contracts on Veryscan:");
  console.log(`https://veryscan.io/address/${nftAddress}`);
  console.log(`https://veryscan.io/address/${vaultAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });