import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const UNSTAKE_FEE = 0.05 * LAMPORTS_PER_SOL; // 0.05 SOL in lamports
export const SECONDS_PER_DAY = 86400;

export const REWARD_TYPES = {
  LINEAR: 'LINEAR',
  TIERED: 'TIERED'
};

export const DEFAULT_TIERS = [
  { threshold: 7, multiplier: 1 },    // 1x for first 7 days
  { threshold: 14, multiplier: 1.5 }, // 1.5x for 8-14 days
  { threshold: 30, multiplier: 2 },   // 2x for 15-30 days
  { threshold: 60, multiplier: 2.5 }  // 2.5x for 31-60 days
];

export const ERROR_MESSAGES = {
  INSUFFICIENT_BALANCE: 'Insufficient balance for unstaking fee',
  INVALID_TOKEN: 'Invalid reward token address',
  UNAUTHORIZED: 'Unauthorized. Only collection admin can perform this action',
  MAX_STAKED: 'Maximum staking limit reached'
}; 