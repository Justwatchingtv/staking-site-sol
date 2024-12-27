import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { calculateRewards } from '../utils/rewardCalculator';

const StakingContext = createContext({});

export function StakingProvider({ children }) {
  const { publicKey } = useWallet();
  const [stakedNFTs, setStakedNFTs] = useState([]);
  const [rewards, setRewards] = useState({});
  const [settings, setSettings] = useState({
    rewardToken: '',
    rewardType: 'LINEAR',
    baseRewardRate: 0,
    maxStaked: 1000,
    tiers: []
  });

  // Update rewards every minute
  useEffect(() => {
    if (!stakedNFTs.length) return;

    const updateRewards = () => {
      const currentTime = Date.now() / 1000;
      const newRewards = {};

      stakedNFTs.forEach(nft => {
        newRewards[nft.mint.toString()] = calculateRewards(
          nft.stakingData,
          settings,
          currentTime
        );
      });

      setRewards(newRewards);
    };

    const interval = setInterval(updateRewards, 60000); // Every minute
    updateRewards(); // Initial calculation

    return () => clearInterval(interval);
  }, [stakedNFTs, settings]);

  const getRewardsForNFT = useCallback((nftMint) => {
    return rewards[nftMint.toString()] || 0;
  }, [rewards]);

  const value = {
    stakedNFTs,
    rewards,
    settings,
    getRewardsForNFT,
    setStakedNFTs,
    setSettings
  };

  return (
    <StakingContext.Provider value={value}>
      {children}
    </StakingContext.Provider>
  );
}

export const useStaking = () => useContext(StakingContext); 