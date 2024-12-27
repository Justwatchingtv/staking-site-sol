import { 
  Transaction, 
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
} from '@solana/web3.js';
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';

export const claimRewards = async (
  connection,
  wallet,
  nft,
  rewardToken,
  rewardAmount
) => {
  if (!wallet.publicKey) throw new Error('Wallet not connected');

  const transaction = new Transaction();

  // Get token accounts
  const userRewardAccount = await getAssociatedTokenAddress(
    new PublicKey(rewardToken),
    wallet.publicKey
  );

  const treasuryAccount = await getAssociatedTokenAddress(
    new PublicKey(rewardToken),
    new PublicKey(process.env.REACT_APP_TREASURY_WALLET)
  );

  // Add reward transfer instruction
  transaction.add(
    createTransferInstruction(
      treasuryAccount,
      userRewardAccount,
      new PublicKey(process.env.REACT_APP_TREASURY_WALLET),
      rewardAmount
    )
  );

  // Add claim timestamp update instruction
  // TODO: Add your program's claim update instruction

  return transaction;
}; 