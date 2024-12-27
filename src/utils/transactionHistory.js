import { PublicKey } from '@solana/web3.js';

export const fetchTransactionHistory = async (connection, wallet, programId) => {
  if (!wallet.publicKey) return [];

  const signatures = await connection.getSignaturesForAddress(
    new PublicKey(programId),
    { limit: 50 }
  );

  const transactions = await Promise.all(
    signatures.map(async (sig) => {
      const tx = await connection.getParsedTransaction(sig.signature, 'confirmed');
      return {
        signature: sig.signature,
        timestamp: sig.blockTime,
        type: parseTransactionType(tx),
        amount: parseTransactionAmount(tx),
        status: tx?.meta?.err ? 'failed' : 'success'
      };
    })
  );

  return transactions.filter(tx => tx.type !== 'unknown');
};

const parseTransactionType = (tx) => {
  // Add logic to determine transaction type (stake, unstake, claim)
  // based on your program's instruction data
  return 'unknown';
};

const parseTransactionAmount = (tx) => {
  // Add logic to extract amount from transaction data
  return 0;
}; 