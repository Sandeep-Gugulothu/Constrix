const { ethers } = require("hardhat");

async function main() {
  console.log("Starting Constrix smart contract deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Get account balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "VERY");
  
  // Deploy ConsistencyNFT first
  console.log("\n1. Deploying ConsistencyNFT...");
  const ConsistencyNFT = await ethers.getContractFactory("ConsistencyNFT");
  const consistencyNFT = await ConsistencyNFT.deploy(
    "Constrix Consistency Badges",
    "CCB",
    "https://api.constrix.app/metadata/" // Base URI for NFT metadata
  );
  await consistencyNFT.deployed();
  console.log("ConsistencyNFT deployed to:", consistencyNFT.address);
  
  // Deploy HabitVault
  console.log("\n2. Deploying HabitVault...");
  const HabitVault = await ethers.getContractFactory("HabitVault");
  
  // VERY token address on Verychain (replace with actual address)
  const VERY_TOKEN_ADDRESS = process.env.VERY_TOKEN_ADDRESS || "0x1234567890123456789012345678901234567890";
  
  const habitVault = await HabitVault.deploy(
    VERY_TOKEN_ADDRESS,
    consistencyNFT.address
  );
  await habitVault.deployed();
  console.log("HabitVault deployed to:", habitVault.address);
  
  // Authorize HabitVault to mint NFTs
  console.log("\n3. Authorizing HabitVault as NFT minter...");
  const authTx = await consistencyNFT.authorizeMinter(habitVault.address, true);
  await authTx.wait();
  console.log("HabitVault authorized as minter");
  
  // Authorize backend service (replace with actual backend address)
  const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS || deployer.address;
  console.log("\n4. Authorizing backend service...");
  const backendAuthTx = await habitVault.authorizeBackend(BACKEND_ADDRESS, true);
  await backendAuthTx.wait();
  console.log("Backend service authorized:", BACKEND_ADDRESS);
  
  // Display deployment summary
  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("Network:", network.name);
  console.log("Deployer:", deployer.address);
  console.log("ConsistencyNFT:", consistencyNFT.address);
  console.log("HabitVault:", habitVault.address);
  console.log("VERY Token:", VERY_TOKEN_ADDRESS);
  console.log("Backend Service:", BACKEND_ADDRESS);
  
  // Save deployment addresses for environment files
  const deploymentInfo = {
    network: network.name,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      ConsistencyNFT: consistencyNFT.address,
      HabitVault: habitVault.address
    },
    config: {
      veryToken: VERY_TOKEN_ADDRESS,
      backendService: BACKEND_ADDRESS,
      nftBaseURI: "https://api.constrix.app/metadata/"
    },
    // Environment variables to update
    envVars: {
      HABIT_VAULT_ADDRESS: habitVault.address,
      CONSISTENCY_NFT_ADDRESS: consistencyNFT.address,
      VERY_TOKEN_ADDRESS: VERY_TOKEN_ADDRESS
    }
  };
  
  console.log("\n=== ENVIRONMENT VARIABLES TO UPDATE ===");
  console.log("Add these to your backend .env file:");
  console.log(`HABIT_VAULT_ADDRESS=${habitVault.address}`);
  console.log(`CONSISTENCY_NFT_ADDRESS=${consistencyNFT.address}`);
  console.log(`VERY_TOKEN_ADDRESS=${VERY_TOKEN_ADDRESS}`);
  
  console.log("\nAdd these to your frontend .env.local file:");
  console.log(`NEXT_PUBLIC_HABIT_VAULT_ADDRESS=${habitVault.address}`);
  console.log(`NEXT_PUBLIC_CONSISTENCY_NFT_ADDRESS=${consistencyNFT.address}`);
  
  console.log("\n=== DEPLOYMENT INFO ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n✅ Deployment completed successfully!");
  console.log("\n🔥 Next steps:");
  console.log("1. Update your backend .env with the contract addresses above");
  console.log("2. Update your frontend .env.local with the contract addresses above");
  console.log("3. Fund the HabitVault contract with VERY tokens for rewards");
  console.log("4. Test the milestone recording functionality");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });