import { Connection, PublicKey } from '@solana/web3.js';
import { STAKING_PROGRAM_ID } from '../contracts/StakingProgram';

export const stakingAPI = {
  getPoolStats: async (connection) => {
    try {
      const programId = new PublicKey(STAKING_PROGRAM_ID);
      const accounts = await connection.getProgramAccounts(programId);
      return {
        totalStaked: accounts.length,
        totalRewardsDistributed: 0, // Calculate from program state
        stakersCount: new Set(accounts.map(acc => acc.pubkey.toString())).size,
        apr: 0 // Calculate based on reward rate
      };
    } catch (error) {
      console.error('Error fetching pool stats:', error);
      throw error;
    }
  },

  getUserStats: async (connection, walletAddress) => {
    try {
      const wallet = new PublicKey(walletAddress);
      const programId = new PublicKey(STAKING_PROGRAM_ID);
      
      // Fetch user's staked NFTs
      const filters = [
        {
          memcmp: {
            offset: 8, // Adjust based on your account structure
            bytes: wallet.toBase58()
          }
        }
      ];
      
      const accounts = await connection.getProgramAccounts(programId, { filters });
      
      return {
        stakedCount: accounts.length,
        totalRewards: 0, // Calculate from account data
        rewardsRate: 0 // Calculate from staking parameters
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  getRewardsHistory: async (connection, walletAddress) => {
    try {
      const wallet = new PublicKey(walletAddress);
      // Fetch and return reward claim history
      return [];
    } catch (error) {
      console.error('Error fetching rewards history:', error);
      throw error;
    }
  }
}; 