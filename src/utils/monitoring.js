import { Analytics } from './analytics';

export class PerformanceMonitor {
  static async measureTransaction(connection, signature) {
    try {
      const start = performance.now();
      const tx = await connection.getTransaction(signature);
      const end = performance.now();

      Analytics.trackEvent('Transaction Performance', {
        signature,
        duration: end - start,
        slot: tx?.slot,
        confirmationTime: tx?.blockTime,
      });

      return end - start;
    } catch (error) {
      console.error('Performance monitoring error:', error);
    }
  }

  static async checkNetworkHealth(connection) {
    try {
      const start = performance.now();
      const health = await connection.getHealth();
      const end = performance.now();

      Analytics.trackEvent('Network Health', {
        status: health,
        responseTime: end - start
      });

      return health;
    } catch (error) {
      console.error('Network health check error:', error);
      return 'unhealthy';
    }
  }
} 