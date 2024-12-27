import { 
  Transaction, 
  PublicKey, 
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token';

export const initializeTreasury = async (
  connection,
  adminPublicKey,
  rewardMint
) => {
  const transaction = new Transaction();
  
  // Get the treasury token account
  const treasuryATA = await getAssociatedTokenAddress(
    new PublicKey(rewardMint),
    adminPublicKey
  );

  // Check if the treasury token account exists
  const tokenAccount = await connection.getAccountInfo(treasuryATA);
  
  // If it doesn't exist, create it
  if (!tokenAccount) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        adminPublicKey,
        treasuryATA,
        adminPublicKey,
        new PublicKey(rewardMint)
      )
    );
  }

  return { transaction, treasuryATA };
};

export const addRewardTokens = async (
  connection,
  adminPublicKey,
  rewardMint,
  amount
) => {
  const transaction = new Transaction();

  const treasuryATA = await getAssociatedTokenAddress(
    new PublicKey(rewardMint),
    adminPublicKey
  );

  const userATA = await getAssociatedTokenAddress(
    new PublicKey(rewardMint),
    adminPublicKey
  );

  transaction.add(
    createTransferInstruction(
      userATA,
      treasuryATA,
      adminPublicKey,
      amount
    )
  );

  return transaction;
};

export const withdrawRewardTokens = async (
  connection,
  adminPublicKey,
  rewardMint,
  amount
) => {
  const transaction = new Transaction();

  const treasuryATA = await getAssociatedTokenAddress(
    new PublicKey(rewardMint),
    adminPublicKey
  );

  const userATA = await getAssociatedTokenAddress(
    new PublicKey(rewardMint),
    adminPublicKey
  );

  transaction.add(
    createTransferInstruction(
      treasuryATA,
      userATA,
      adminPublicKey,
      amount
    )
  );

  return transaction;
};

export const getTreasuryBalance = async (
  connection,
  adminPublicKey,
  rewardMint
) => {
  const treasuryATA = await getAssociatedTokenAddress(
    new PublicKey(rewardMint),
    adminPublicKey
  );

  try {
    const balance = await connection.getTokenAccountBalance(treasuryATA);
    return balance.value.uiAmount;
  } catch (error) {
    console.error('Error getting treasury balance:', error);
    return 0;
  }
}; 