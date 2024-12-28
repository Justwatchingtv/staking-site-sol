import { PublicKey } from '@solana/web3.js';

export interface StakeAccount {
  nftMint: PublicKey;
  owner: PublicKey;
  stakeStartTime: number;
  lastRewardClaim: number;
  rewardRate: number;
}

export interface PoolConfig {
  authority: PublicKey;
  rewardMint: PublicKey;
  baseRewardRate: number;
  maxStaked: number;
  unstakeFee: number;
} 