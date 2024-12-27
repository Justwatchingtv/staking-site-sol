import { REWARD_TYPES, SECONDS_PER_DAY } from './constants';

export const calculateRewards = (
  stakingData,
  settings,
  currentTimestamp
) => {
  const {
    stakingStartTime,
    lastClaimTime = stakingStartTime,
    baseRewardRate,
    rewardType,
    tiers
  } = settings;

  const stakingDuration = (currentTimestamp - stakingStartTime) / SECONDS_PER_DAY;
  const timeSinceLastClaim = (currentTimestamp - lastClaimTime) / SECONDS_PER_DAY;

  if (rewardType === REWARD_TYPES.LINEAR) {
    return baseRewardRate * timeSinceLastClaim;
  }

  // For tiered rewards
  const currentTier = tiers
    .sort((a, b) => b.threshold - a.threshold)
    .find(tier => stakingDuration >= tier.threshold) || tiers[0];

  return baseRewardRate * currentTier.multiplier * timeSinceLastClaim;
};

export const calculateAPR = (settings) => {
  const { baseRewardRate, rewardType, tiers } = settings;

  if (rewardType === REWARD_TYPES.LINEAR) {
    return (baseRewardRate * 365) / 1; // Assuming 1 token staked
  }

  // For tiered rewards, calculate weighted average APR
  const totalDays = tiers[tiers.length - 1].threshold;
  let weightedRewards = 0;

  tiers.forEach((tier, index) => {
    const daysInTier = index === 0 
      ? tier.threshold 
      : tier.threshold - tiers[index - 1].threshold;
    
    weightedRewards += (baseRewardRate * tier.multiplier * daysInTier);
  });

  return (weightedRewards * 365) / totalDays;
};

export const estimateRewards = (
  stakingDuration,
  settings
) => {
  const { baseRewardRate, rewardType, tiers } = settings;

  if (rewardType === REWARD_TYPES.LINEAR) {
    return baseRewardRate * stakingDuration;
  }

  let totalRewards = 0;
  let remainingDays = stakingDuration;

  tiers.sort((a, b) => a.threshold - b.threshold)
    .forEach((tier, index) => {
      const prevThreshold = index > 0 ? tiers[index - 1].threshold : 0;
      const daysInTier = Math.min(
        remainingDays,
        tier.threshold - prevThreshold
      );

      if (daysInTier > 0) {
        totalRewards += baseRewardRate * tier.multiplier * daysInTier;
        remainingDays -= daysInTier;
      }
    });

  return totalRewards;
}; 