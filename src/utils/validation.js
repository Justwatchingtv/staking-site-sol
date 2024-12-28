import { PublicKey } from '@solana/web3.js';

export const validatePublicKey = (address) => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const validateRewardRate = (rate) => {
  const num = parseFloat(rate);
  return !isNaN(num) && num >= 0;
};

export const validateMaxStaked = (max) => {
  const num = parseInt(max);
  return !isNaN(num) && num > 0;
};

export const validateTier = (tier) => {
  return (
    validateAmount(tier.threshold) &&
    validateAmount(tier.multiplier) &&
    tier.threshold > 0 &&
    tier.multiplier > 0
  );
}; 