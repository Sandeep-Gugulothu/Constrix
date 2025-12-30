import { ethers, BrowserProvider, formatEther, JsonRpcSigner } from 'ethers';
import api from './api';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface MilestoneSync {
  milestoneDays: number;
  habitType: string;
  success: boolean;
  txHash?: string;
  error?: string;
}

interface BlockchainStreak {
  currentStreak: number;
  longestStreak: number;
  lastUpdate: number;
}

interface NFTBadge {
  tokenId: number;
  habitType: string;
  days: number;
  timestamp: number;
}

interface ContractHealth {
  veryBalance: string;
  totalNFTs: number;
  isHealthy: boolean;
}

interface SyncResponse {
  success: boolean;
  synced: number;
  results: MilestoneSync[];
  message: string;
}

export class BlockchainService {
  private static instance: BlockchainService;
  private provider: BrowserProvider | null = null;
  private signer: JsonRpcSigner | null = null;
  private isInitializing = false;

  private constructor() {
    // Private constructor to enforce singleton
  }

  static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      if (this.isInitializing) {
        return false;
      }

      this.isInitializing = true;

      if (typeof window === 'undefined' || !window.ethereum) {
        console.warn('MetaMask not detected');
        return false;
      }

      // Check if already initialized
      if (this.provider && this.signer) {
        return true;
      }

      this.provider = new BrowserProvider(window.ethereum);
      
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.signer = await this.provider.getSigner();
      return true;
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      return false;
    } finally {
      this.isInitializing = false;
    }
  }

  isInitialized(): boolean {
    return !!(this.provider && this.signer);
  }

  /**
   * Sync pending milestones to blockchain
   */
  async syncMilestones(): Promise<SyncResponse> {
    try {
      const response = await api.post('/blockchain/sync');
      const data = response.data;
      
      return {
        success: data.success || true,
        synced: data.synced || 0,
        results: data.results || [],
        message: data.message || 'Sync completed successfully'
      };
    } catch (error: any) {
      console.error('Milestone sync failed:', error);
      return {
        success: false,
        synced: 0,
        results: [],
        message: error.response?.data?.error || error.message || 'Sync failed'
      };
    }
  }

  /**
   * Get blockchain streak data for a habit
   */
  async getBlockchainStreak(habitType: 'study' | 'fitness'): Promise<BlockchainStreak | null> {
    try {
      const response = await api.get(`/blockchain/streak/${habitType}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get blockchain streak:', error);
      return null;
    }
  }

  /**
   * Get user's NFT badges
   */
  async getUserBadges(): Promise<NFTBadge[]> {
    try {
      const response = await api.get('/blockchain/badges');
      return response.data?.badges || [];
    } catch (error) {
      console.error('Failed to get badges:', error);
      return [];
    }
  }

  /**
   * Get contract health status
   */
  async getContractHealth(): Promise<ContractHealth | null> {
    try {
      const response = await api.get('/blockchain/health');
      const data = response.data;
      
      return {
        veryBalance: data.veryBalance || '0',
        totalNFTs: data.totalNFTs || 0,
        isHealthy: data.isHealthy || false
      };
    } catch (error) {
      console.error('Failed to get contract health:', error);
      return null;
    }
  }

  /**
   * Check if user's wallet is connected to the correct network
   */
  async checkNetwork(): Promise<{ correct: boolean; chainId?: number; name?: string }> {
    try {
      if (!this.provider) {
        const initialized = await this.initialize();
        if (!initialized) {
          return { correct: false };
        }
      }

      if (!this.provider) {
        return { correct: false };
      }

      const network = await this.provider.getNetwork();
      const expectedChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '12345');
      
      return {
        correct: Number(network.chainId) === expectedChainId,
        chainId: Number(network.chainId),
        name: network.name
      };
    } catch (error) {
      console.error('Network check failed:', error);
      return { correct: false };
    }
  }

  /**
   * Switch to the correct network
   */
  async switchNetwork(): Promise<boolean> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        console.error('No Ethereum provider found');
        return false;
      }

      const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '0x3039';
      const currentNetwork = await this.checkNetwork();
      
      if (currentNetwork.correct) {
        return true; // Already on correct network
      }

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }]
        });
        return true;
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          return await this.addNetwork();
        }
        throw switchError;
      }
    } catch (error) {
      console.error('Network switch failed:', error);
      return false;
    }
  }

  /**
   * Add Verychain network to MetaMask
   */
  async addNetwork(): Promise<boolean> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        return false;
      }

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID || '0x3039',
          chainName: 'Verychain Testnet',
          nativeCurrency: {
            name: 'VERY',
            symbol: 'VERY',
            decimals: 18
          },
          rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || 'https://testnet-rpc.verychain.io'],
          blockExplorerUrls: ['https://testnet-explorer.verychain.io']
        }]
      });

      return true;
    } catch (error) {
      console.error('Add network failed:', error);
      return false;
    }
  }

  /**
   * Get user's VERY token balance
   */
  async getVERYBalance(): Promise<string> {
    try {
      if (!this.provider || !this.signer) {
        const initialized = await this.initialize();
        if (!initialized) {
          return '0';
        }
      }

      if (!this.provider || !this.signer) {
        return '0';
      }

      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);
      
      return formatEther(balance);
    } catch (error) {
      console.error('Failed to get VERY balance:', error);
      return '0';
    }
  }

  /**
   * Get connected wallet address
   */
  async getWalletAddress(): Promise<string | null> {
    try {
      if (!this.signer) {
        const initialized = await this.initialize();
        if (!initialized) {
          return null;
        }
      }

      if (!this.signer) {
        return null;
      }

      return await this.signer.getAddress();
    } catch (error) {
      console.error('Failed to get wallet address:', error);
      return null;
    }
  }

  /**
   * Format milestone rewards for display
   */
  static formatReward(days: number): string {
    const rewards: Record<number, number> = {
      7: 100,
      14: 180,
      30: 300,
      60: 480,
      100: 700,
      365: 2000
    };

    return rewards[days] ? `${rewards[days]} VERY` : '0 VERY';
  }

  /**
   * Get milestone NFT image URL
   */
  static getNFTImageUrl(habitType: string, days: number): string {
    const baseUrl = process.env.NEXT_PUBLIC_NFT_BASE_URL || 'https://api.constrix.app/nft';
    return `${baseUrl}/${habitType}_${days}.png`;
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.provider = null;
    this.signer = null;
  }

  /**
   * Listen for account changes
   */
  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }

  /**
   * Listen for chain changes
   */
  onChainChanged(callback: (chainId: string) => void): void {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }

  /**
   * Remove event listeners
   */
  removeListeners(): void {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  }
}