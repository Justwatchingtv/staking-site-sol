import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { 
  PublicKey, 
  Transaction, 
  SystemProgram 
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  getAssociatedTokenAddress 
} from '@solana/spl-token';
import { REWARD_TYPES, DEFAULT_TIERS } from '../../utils/constants';
import {
  initializeTreasury,
  addRewardTokens,
  withdrawRewardTokens,
  getTreasuryBalance
} from '../../utils/treasuryManager';
import './AdminPanel.css';

const AdminPanel = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [settings, setSettings] = useState({
    rewardToken: '',
    rewardType: REWARD_TYPES.LINEAR,
    baseRewardRate: 0,
    maxStaked: 1000,
    tiers: DEFAULT_TIERS,
    treasuryBalance: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addTokenAmount, setAddTokenAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    if (publicKey) {
      fetchTreasuryBalance();
    }
  }, [publicKey]);

  const fetchTreasuryBalance = async () => {
    if (!settings.rewardToken || !publicKey) return;
    
    const balance = await getTreasuryBalance(
      connection,
      publicKey,
      settings.rewardToken
    );
    
    setSettings(prev => ({ ...prev, treasuryBalance: balance }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // TODO: Add transaction to update program settings
      const transaction = new Transaction();
      
      // Add instructions to update:
      // - Reward token
      // - Reward type
      // - Base rate
      // - Max staked
      // - Tiers (if TIERED type)
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTier = () => {
    setSettings(prev => ({
      ...prev,
      tiers: [...prev.tiers, { threshold: 0, multiplier: 1 }]
    }));
  };

  const handleUpdateTier = (index, field, value) => {
    setSettings(prev => ({
      ...prev,
      tiers: prev.tiers.map((tier, i) => 
        i === index ? { ...tier, [field]: parseFloat(value) } : tier
      )
    }));
  };

  const handleAddRewardTokens = async () => {
    if (!settings.rewardToken || !addTokenAmount) return;
    setIsLoading(true);

    try {
      const transaction = await addRewardTokens(
        connection,
        publicKey,
        settings.rewardToken,
        parseFloat(addTokenAmount)
      );
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      await fetchTreasuryBalance();
      setAddTokenAmount('');
    } catch (error) {
      console.error('Error adding reward tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawTokens = async () => {
    if (!settings.rewardToken || !withdrawAmount) return;
    setIsLoading(true);

    try {
      const transaction = await withdrawRewardTokens(
        connection,
        publicKey,
        settings.rewardToken,
        parseFloat(withdrawAmount)
      );
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      await fetchTreasuryBalance();
      setWithdrawAmount('');
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Staking Admin Panel</h2>
      
      <div className="settings-section">
        <h3>Staking Settings</h3>
        {isEditing ? (
          <>
            <div className="setting-item">
              <label>Reward Token Address:</label>
              <input
                type="text"
                value={settings.rewardToken}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  rewardToken: e.target.value 
                }))}
              />
            </div>

            <div className="setting-item">
              <label>Reward Type:</label>
              <select
                value={settings.rewardType}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  rewardType: e.target.value 
                }))}
              >
                <option value={REWARD_TYPES.LINEAR}>Linear</option>
                <option value={REWARD_TYPES.TIERED}>Tiered</option>
              </select>
            </div>

            <div className="setting-item">
              <label>Base Reward Rate (tokens/day):</label>
              <input
                type="number"
                value={settings.baseRewardRate}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  baseRewardRate: parseFloat(e.target.value) 
                }))}
              />
            </div>

            <div className="setting-item">
              <label>Maximum Stakeable NFTs:</label>
              <input
                type="number"
                value={settings.maxStaked}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  maxStaked: parseInt(e.target.value) 
                }))}
              />
            </div>

            {settings.rewardType === REWARD_TYPES.TIERED && (
              <div className="tiers-section">
                <h4>Reward Tiers</h4>
                {settings.tiers.map((tier, index) => (
                  <div key={index} className="tier-item">
                    <input
                      type="number"
                      value={tier.threshold}
                      onChange={(e) => handleUpdateTier(index, 'threshold', e.target.value)}
                      placeholder="Days"
                    />
                    <input
                      type="number"
                      value={tier.multiplier}
                      onChange={(e) => handleUpdateTier(index, 'multiplier', e.target.value)}
                      placeholder="Multiplier"
                    />
                  </div>
                ))}
                <button onClick={handleAddTier}>Add Tier</button>
              </div>
            )}

            <div className="action-buttons">
              <button 
                onClick={handleSaveSettings}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Settings'}
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="current-settings">
              <p>Reward Token: {settings.rewardToken}</p>
              <p>Reward Type: {settings.rewardType}</p>
              <p>Base Rate: {settings.baseRewardRate} tokens/day</p>
              <p>Max Stakeable: {settings.maxStaked} NFTs</p>
              <button onClick={() => setIsEditing(true)}>Edit Settings</button>
            </div>
          </>
        )}
      </div>

      <div className="treasury-section">
        <h3>Treasury Management</h3>
        <p>Current Balance: {settings.treasuryBalance} tokens</p>
        
        <div className="treasury-actions">
          <div className="treasury-input">
            <input
              type="number"
              value={addTokenAmount}
              onChange={(e) => setAddTokenAmount(e.target.value)}
              placeholder="Amount to add"
            />
            <button 
              onClick={handleAddRewardTokens}
              disabled={isLoading || !addTokenAmount}
            >
              Add Tokens
            </button>
          </div>

          <div className="treasury-input">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Amount to withdraw"
            />
            <button 
              onClick={handleWithdrawTokens}
              disabled={isLoading || !withdrawAmount}
            >
              Withdraw Tokens
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 