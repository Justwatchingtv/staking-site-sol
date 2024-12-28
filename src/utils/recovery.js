import { PublicKey, Transaction } from '@solana/web3.js';
import { StakingError } from './errorHandling';

export class TransactionRecovery {
  static async retryTransaction(
    connection,
    wallet,
    buildTransaction,
    maxAttempts = 3
  ) {
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const transaction = await buildTransaction();
        const signature = await wallet.sendTransaction(transaction, connection);
        
        await connection.confirmTransaction(signature, 'confirmed');
        
        Analytics.trackEvent('Transaction Recovery Success', {
          attempt,
          signature
        });
        
        return signature;
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error);
        
        Analytics.trackEvent('Transaction Recovery Attempt Failed', {
          attempt,
          error: error.message
        });
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    throw new StakingError(
      ErrorTypes.TRANSACTION_ERROR,
      'Transaction failed after multiple attempts',
      lastError
    );
  }

  static async checkStuckTransactions(connection, wallet) {
    try {
      const signatures = await connection.getSignaturesForAddress(
        wallet.publicKey,
        { limit: 10 }
      );

      const unconfirmedTxs = signatures.filter(sig => !sig.confirmationStatus);
      
      if (unconfirmedTxs.length > 0) {
        Analytics.trackEvent('Stuck Transactions Detected', {
          count: unconfirmedTxs.length
        });
      }

      return unconfirmedTxs;
    } catch (error) {
      console.error('Error checking stuck transactions:', error);
      return [];
    }
  }
} 