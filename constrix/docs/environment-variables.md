# Constrix Production Environment Variables

## Backend (Railway)
```env
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/constrix?retryWrites=true&w=majority

# JWT Secret (generate strong secret)
JWT_SECRET=your-super-secure-jwt-secret-for-production-2024

# Blockchain
VERYCHAIN_RPC_URL=https://rpc.verychain.io
BLOCKCHAIN_PRIVATE_KEY=your-production-private-key
HABIT_VAULT_ADDRESS=0x... # From contract deployment
CONSISTENCY_NFT_ADDRESS=0x... # From contract deployment  
VERY_TOKEN_ADDRESS=0x... # VERY token contract address

# CORS
CORS_ORIGINS=https://constrix.vercel.app,https://constrix.app
```

## Frontend (Vercel)
```env
# API URL (update after backend deployment)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api

# Wepin Wallet
NEXT_PUBLIC_WEPIN_APP_ID=553f9124a8cccf5e941e53dbbe9d7029
NEXT_PUBLIC_WEPIN_APP_KEY=ak_live_b1MDONrFwyYfiP6ncLhzB46dNfAJfy9OY4xL5aXaREq

# Blockchain - Mainnet
NEXT_PUBLIC_CHAIN_ID=0x3039
NEXT_PUBLIC_RPC_URL=https://rpc.verychain.io
NEXT_PUBLIC_NFT_BASE_URL=https://api.constrix.app/nft
```

## Contracts Deployment
```env
# Verychain Network
VERYCHAIN_TESTNET_RPC=https://testnet-rpc.verychain.io
VERYCHAIN_MAINNET_RPC=https://rpc.verychain.io

# Deployment
PRIVATE_KEY=your-deployment-private-key
VERY_TOKEN_ADDRESS=0x... # VERY token contract address
BACKEND_ADDRESS=0x... # Backend wallet address for authorization

# Contract Configuration
NFT_BASE_URI=https://api.constrix.app/metadata/
CONTRACT_OWNER=0x... # Your wallet address
```

## Security Notes
- Never commit private keys to git
- Use strong, unique JWT secrets
- Rotate secrets regularly
- Use environment-specific RPC URLs
- Whitelist specific CORS origins in production