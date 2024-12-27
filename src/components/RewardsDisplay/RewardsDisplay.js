import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useStaking } from '../../context/StakingContext';
import { calculateRewards, calculateAPR, estimateRewards } from '../../utils/rewardCalculator';
import { claimRewards } from '../../utils/claimRewards';
import { monitorTransaction } from '../../utils/transactionMonitor';
import './RewardsDisplay.css';

const RewardsDisplay = ({ nft }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { settings, getRewardsForNFT } = useStaking();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rewardsData, setRewardsData] = useState({
    currentRewards: 0,
    estimatedAPR: 0,
    projectedRewards: 0
  });

  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (!nft || !settings) {
      setError('Missing required data');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get current rewards from context
      const currentRewards = getRewardsForNFT(nft.address);
      
      // Calculate APR
      const apr = calculateAPR(settings);
      
      // Calculate 30-day projection
      const thirtyDayEstimate = estimateRewards(30, settings);

      setRewardsData({
        currentRewards,
        estimatedAPR: apr,
        projectedRewards: thirtyDayEstimate
      });
      setError(null);
    } catch (err) {
      setError('Error calculating rewards');
      console.error('Rewards calculation error:', err);
    } finally {
      setLoading(false);
    }
  }, [nft, settings, getRewardsForNFT]);

  const handleClaim = async () => {
    if (!nft || !settings.rewardToken || claiming) return;
    
    setClaiming(true);
    try {
      const transaction = await claimRewards(
        connection,
        wallet,
        nft,
        settings.rewardToken,
        rewardsData.currentRewards
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      
      const success = await monitorTransaction(
        connection,
        signature,
        'Claim Rewards'
      );

      if (success) {
        setRewardsData(prev => ({
          ...prev,
          currentRewards: 0
        }));
      }

    } catch (error) {
      console.error('Error claiming rewards:', error);
      setError('Failed to claim rewards');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return <div className="rewards-display loading">Calculating rewards...</div>;
  }

  if (error) {
    return <div className="rewards-display error">{error}</div>;
  }

  return (
    <div className="rewards-display">
      <h3>Rewards Information</h3>
      <div className="rewards-info">
        <div className="reward-item">
          <label>Current Rewards:</label>
          <span>{rewardsData.currentRewards.toFixed(2)} tokens</span>
        </div>
        <div className="reward-item">
          <label>Estimated APR:</label>
          <span>{rewardsData.estimatedAPR.toFixed(2)}%</span>
        </div>
        <div className="reward-item">
          <label>30-Day Projection:</label>
          <span>{rewardsData.projectedRewards.toFixed(2)} tokens</span>
        </div>
        {rewardsData.currentRewards > 0 && (
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="claim-button"
          >
            {claiming ? 'Claiming...' : 'Claim Rewards'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RewardsDisplay; 