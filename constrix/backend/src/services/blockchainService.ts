import { ethers } from 'ethers';
import { MILESTONE_REWARDS } from '@constrix/shared';

interface ContractAddresses {
  habitVault: string;
  consistencyNFT: string;
  veryToken: string;
}

export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contracts: ContractAddresses;
  private habitVaultContract: ethers.Contract;
  private nftContract: ethers.Contract;

  constructor() {
    // Initialize provider for Verychain
    this.provider = new ethers.JsonRpcProvider(
      process.env.VERYCHAIN_RPC_URL || 'https://testnet-rpc.verychain.io'
    );

    // Initialize wallet for backend operations
    this.wallet = new ethers.Wallet(
      process.env.BLOCKCHAIN_PRIVATE_KEY!,
      this.provider
    );

    // Contract addresses (from deployment)
    this.contracts = {
      habitVault: process.env.HABIT_VAULT_ADDRESS!,
      consistencyNFT: process.env.CONSISTENCY_NFT_ADDRESS!,
      veryToken: process.env.VERY_TOKEN_ADDRESS!
    };

    // Initialize contract instances
    this.habitVaultContract = new ethers.Contract(
      this.contracts.habitVault,
      this.getHabitVaultABI(),
      this.wallet
    );

    this.nftContract = new ethers.Contract(
      this.contracts.consistencyNFT,
      this.getConsistencyNFTABI(),
      this.wallet
    );
  }

  /**
   * Record a milestone achievement on-chain
   */
  async recordMilestone(
    userAddress: string,
    habitType: 'study' | 'fitness',
    days: number
  ): Promise<{ txHash: string; success: boolean }> {
    try {
      const habitTypeEnum = habitType === 'study' ? 0 : 1;
      
      // Check if milestone is valid
      const milestoneRewards: { [key: number]: number } = {
        7: 10,
        14: 25,
        30: 50,
        60: 100,
        100: 200,
        365: 1000
      };
      
      if (!milestoneRewards[days]) {
        throw new Error(`Invalid milestone: ${days} days`);
      }

      // Check if already claimed
      const isClaimed = await this.habitVaultContract.isMilestoneClaimed(
        userAddress,
        habitTypeEnum,
        days
      );

      if (isClaimed) {
        throw new Error('Milestone already claimed');
      }

      // Record milestone on-chain
      const tx = await this.habitVaultContract.recordMilestone(
        userAddress,
        habitTypeEnum,
        days,
        {
          gasLimit: 300000 // Adjust based on actual gas usage
        }
      );

      await tx.wait();

      return {
        txHash: tx.hash,
        success: true
      };
    } catch (error) {
      console.error('Blockchain milestone recording failed:', error);
      return {
        txHash: '',
        success: false
      };
    }
  }

  /**
   * Get user's on-chain streak information
   */
  async getUserStreak(
    userAddress: string,
    habitType: 'study' | 'fitness'
  ): Promise<{
    currentStreak: number;
    longestStreak: number;
    lastUpdate: number;
  }> {
    try {
      const habitTypeEnum = habitType === 'study' ? 0 : 1;
      const streak = await this.habitVaultContract.getUserStreak(
        userAddress,
        habitTypeEnum
      );

      return {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastUpdate: streak.lastUpdate.toNumber()
      };
    } catch (error) {
      console.error('Failed to get user streak:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastUpdate: 0
      };
    }
  }

  /**
   * Get user's NFT badges
   */
  async getUserBadges(userAddress: string): Promise<Array<{
    tokenId: number;
    habitType: string;
    days: number;
    timestamp: number;
  }>> {
    try {
      const tokenIds = await this.nftContract.getBadgesOf(userAddress);
      const badges = [];

      for (const tokenId of tokenIds) {
        const badge = await this.nftContract.getBadge(tokenId);
        badges.push({
          tokenId: tokenId.toNumber(),
          habitType: badge.habitType === 0 ? 'study' : 'fitness',
          days: badge.streakDays,
          timestamp: badge.timestamp.toNumber()
        });
      }

      return badges;
    } catch (error) {
      console.error('Failed to get user badges:', error);
      return [];
    }
  }

  /**
   * Check contract balance and health
   */
  async getContractHealth(): Promise<{
    veryBalance: string;
    totalNFTs: number;
    isHealthy: boolean;
  }> {
    try {
      const balance = await this.habitVaultContract.getBalance();
      const totalSupply = await this.nftContract.totalSupply();

      return {
        veryBalance: ethers.formatEther(balance),
        totalNFTs: totalSupply.toNumber(),
        isHealthy: true
      };
    } catch (error) {
      console.error('Contract health check failed:', error);
      return {
        veryBalance: '0',
        totalNFTs: 0,
        isHealthy: false
      };
    }
  }

  /**
   * Batch process multiple milestones (for efficiency)
   */
  async batchRecordMilestones(
    milestones: Array<{
      userAddress: string;
      habitType: 'study' | 'fitness';
      days: number;
    }>
  ): Promise<Array<{ success: boolean; txHash: string; error?: string }>> {
    const results = [];

    for (const milestone of milestones) {
      try {
        const result = await this.recordMilestone(
          milestone.userAddress,
          milestone.habitType,
          milestone.days
        );
        results.push(result);
        
        // Add delay between transactions to avoid nonce issues
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error: any) {
        results.push({
          success: false,
          txHash: '',
          error: error.message
        });
      }
    }

    return results;
  }

  private getHabitVaultABI() {
    // Simplified ABI - in production, import from compiled artifacts
    return [
      "function recordMilestone(address user, uint8 habitType, uint16 streakDays) external",
      "function getUserStreak(address user, uint8 habitType) external view returns (tuple(uint16 currentStreak, uint16 longestStreak, uint256 lastUpdate))",
      "function isMilestoneClaimed(address user, uint8 habitType, uint16 streakDays) external view returns (bool)",
      "function getBalance() external view returns (uint256)",
      "event MilestoneRecorded(address indexed user, uint8 habitType, uint16 streakDays, uint256 reward)"
    ];
  }

  private getConsistencyNFTABI() {
    // Simplified ABI - in production, import from compiled artifacts
    return [
      "function getBadgesOf(address owner) external view returns (uint256[] memory)",
      "function getBadge(uint256 tokenId) external view returns (tuple(address owner, uint8 habitType, uint16 streakDays, uint256 timestamp, bool soulbound))",
      "function totalSupply() external view returns (uint256)",
      "function tokenURI(uint256 tokenId) external view returns (string memory)"
    ];
  }
}