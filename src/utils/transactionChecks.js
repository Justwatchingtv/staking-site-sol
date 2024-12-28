import { Transaction } from '@solana/web3.js';

export const verifyTransactionSafety = (transaction) => {
  if (!(transaction instanceof Transaction)) {
    throw new Error('Invalid transaction object');
  }

  // Check if transaction has instructions
  if (!transaction.instructions || transaction.instructions.length === 0) {
    throw new Error('Transaction has no instructions');
  }

  // Check for suspicious instruction data size
  const MAX_SAFE_DATA_SIZE = 1024; // 1KB
  const hasLargeData = transaction.instructions.some(
    ix => ix.data.length > MAX_SAFE_DATA_SIZE
  );
  if (hasLargeData) {
    throw new Error('Transaction contains suspiciously large data');
  }

  return true;
};

export const verifyTransactionFees = async (connection, transaction, wallet) => {
  try {
    const { value: fees } = await connection.getFeeForMessage(
      transaction.compileMessage(),
      'confirmed'
    );

    const balance = await connection.getBalance(wallet.publicKey);
    
    if (balance < fees) {
      throw new Error('Insufficient balance for transaction fees');
    }

    return fees;
  } catch (error) {
    throw new Error(`Fee estimation failed: ${error.message}`);
  }
}; 