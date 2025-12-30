import { ethers } from 'ethers';

class MetaMaskService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      const address = await this.signer.getAddress();
      
      // Switch to Verychain network if needed
      await this.switchToVerychain();
      
      return { address };
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected the connection request');
      }
      throw new Error('Failed to connect to MetaMask');
    }
  }

  async switchToVerychain() {
    if (!window.ethereum) return;

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '0x1205';
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.verylabs.io';

    console.log('Environment variables:', {
      chainId,
      rpcUrl,
      hasChainId: !!process.env.NEXT_PUBLIC_CHAIN_ID,
      hasRpcUrl: !!process.env.NEXT_PUBLIC_RPC_URL
    });

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (switchError: any) {
      console.log('Switch error:', switchError);
      // Chain not added to MetaMask
      if (switchError.code === 4902) {
        try {
          console.log('Adding network with params:', {
            chainId,
            chainName: 'Verychain Mainnet',
            rpcUrls: [rpcUrl]
          });
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId,
                chainName: 'Verychain Mainnet',
                nativeCurrency: {
                  name: 'VERY',
                  symbol: 'VERY',
                  decimals: 18,
                },
                rpcUrls: [rpcUrl],
                blockExplorerUrls: ['https://veryscan.io/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Add network error:', addError);
          throw new Error('Failed to add Verychain network');
        }
      } else {
        throw new Error('Failed to switch to Verychain network');
      }
    }
  }

  async signMessage(message: string) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      return await this.signer.signMessage(message);
    } catch (error) {
      throw new Error('Failed to sign message');
    }
  }

  async getAddress() {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    return await this.signer.getAddress();
  }

  isConnected() {
    return !!this.signer;
  }
}

export const metaMaskService = new MetaMaskService();

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}