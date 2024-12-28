import React, { useState, useEffect } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { STAKING_PROGRAM_ID } from '../../contracts/StakingProgram';

const StakingPool = () => {
  const { connection } = useConnection();
  const [poolStats, setPoolStats] = useState({
    totalStaked: 0,
    totalRewardsDistributed: 0,
    stakersCount: 0,
    apr: 0
  });

  useEffect(() => {
    const fetchPoolStats = async () => {
      try {
        const programId = new PublicKey(STAKING_PROGRAM_ID);
        
        // Fetch program accounts
        const accounts = await connection.getProgramAccounts(programId);
        
        // Calculate stats from accounts
        const stats = {
          totalStaked: accounts.length,
          totalRewardsDistributed: 0, // Calculate from program state
          stakersCount: new Set(accounts.map(acc => acc.pubkey.toString())).size,
          apr: 0 // Calculate based on reward rate
        };

        setPoolStats(stats);
      } catch (error) {
        console.error('Error fetching pool stats:', error);
      }
    };

    fetchPoolStats();
    const interval = setInterval(fetchPoolStats, 30000);
    return () => clearInterval(interval);
  }, [connection]);

  return (
    <div className="staking-pool">
      <h2>Staking Pool Statistics</h2>
      <div className="pool-stats">
        <div className="stat-item">
          <label>Total NFTs Staked</label>
          <span>{poolStats.totalStaked}</span>
        </div>
        <div className="stat-item">
          <label>Total Rewards Distributed</label>
          <span>{poolStats.totalRewardsDistributed}</span>
        </div>
        <div className="stat-item">
          <label>Active Stakers</label>
          <span>{poolStats.stakersCount}</span>
        </div>
        <div className="stat-item">
          <label>Current APR</label>
          <span>{poolStats.apr}%</span>
        </div>
      </div>
    </div>
  );
};

export default StakingPool; 