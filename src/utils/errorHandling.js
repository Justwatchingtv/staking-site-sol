import { notify } from './notifications';
import { Analytics } from './analytics';

export const ErrorTypes = {
  WALLET_ERROR: 'WALLET_ERROR',
  TRANSACTION_ERROR: 'TRANSACTION_ERROR',
  PROGRAM_ERROR: 'PROGRAM_ERROR',
  NFT_ERROR: 'NFT_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
};

export class StakingError extends Error {
  constructor(type, message, originalError = null) {
    super(message);
    this.type = type;
    this.originalError = originalError;
  }

  static handleError(error, fallback = null) {
    console.error('Error:', error);
    
    if (error instanceof StakingError) {
      notify({
        type: 'error',
        message: error.message,
        description: error.type
      });
    } else {
      notify({
        type: 'error',
        message: fallback || 'An unexpected error occurred',
        description: 'Please try again'
      });
    }

    // Log to analytics
    logError(error);
  }
} 