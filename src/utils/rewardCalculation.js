import { BN } from '@project-serum/anchor';

export const calculateRewards = (
  stakingStartTime,
  lastClaimTime,
  rewardRate,
  currentTime
) => {
  const timeStaked = currentTime - Math.max(stakingStartTime, lastClaimTime);
  return new BN(timeStaked).mul(new BN(rewardRate));
}; 