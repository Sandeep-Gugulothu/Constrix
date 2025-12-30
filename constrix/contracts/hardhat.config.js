require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  networks: {
    // Verychain Mainnet (No testnet available)
    verychain: {
      url: process.env.VERYCHAIN_MAINNET_RPC || "https://rpc.verylabs.io",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 4613,
      gasPrice: 1000000000, // 1 Gwei minimum
      gas: 8000000 // 8M gas limit per block
    },
    // Local development
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  etherscan: {
    apiKey: {
      verychain_testnet: process.env.VERYCHAIN_API_KEY || "",
      verychain_mainnet: process.env.VERYCHAIN_API_KEY || ""
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
