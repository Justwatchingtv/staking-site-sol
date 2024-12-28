import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { 
  Transaction, 
  SystemProgram, 
  PublicKey 
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { UNSTAKE_FEE } from '../../utils/constants';
import { verifyTransactionSafety, verifyTransactionFees } from '../../utils/transactionChecks';
import './StakingInterface.css';

const StakingInterface = ({ nft, onStakeChange }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [rewardRate, setRewardRate] = useState(0);
  const [rewardToken, setRewardToken] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleStake = async () => {
    if (!publicKey) return;
    setIsProcessing(true);
    setError(null);

    try {
      // Create staking transaction
      const transaction = new Transaction();
      
      // Add NFT transfer instruction
      // TODO: Add instruction to transfer NFT to staking program

      // Verify transaction safety
      verifyTransactionSafety(transaction);

      // Check fees
      await verifyTransactionFees(connection, transaction, wallet);

      // Sign and send transaction
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      onStakeChange && onStakeChange();
    } catch (error) {
      console.error('Staking error:', error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnstake = async () => {
    if (!publicKey) return;
    setIsProcessing(true);

    try {
      const transaction = new Transaction();

      // Add unstaking fee transfer
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey('YOUR_FEE_WALLET'), // Replace with actual fee wallet
          lamports: UNSTAKE_FEE,
        })
      );

      // Add NFT return instruction
      // TODO: Add instruction to return NFT from program

      // Add reward token transfer
      // TODO: Add instruction to transfer accumulated rewards

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      onStakeChange && onStakeChange();
    } catch (error) {
      console.error('Unstaking error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="staking-interface">
      <div className="staking-info">
        <h3>Staking Details</h3>
        <p>Reward Rate: {rewardRate} tokens/day</p>
        <p>Unstaking Fee: 0.05 SOL</p>
      </div>
      <div className="staking-actions">
        <button 
          onClick={handleStake} 
          disabled={isProcessing}
          className="stake-button"
        >
          {isProcessing ? 'Processing...' : 'Stake NFT'}
        </button>
        <button 
          onClick={handleUnstake} 
          disabled={isProcessing}
          className="unstake-button"
        >
          {isProcessing ? 'Processing...' : 'Unstake NFT'}
        </button>
      </div>
      {error && (
        <div className="error-message">{error}</div>
      )}
    </div>
  );
};

export default StakingInterface; 