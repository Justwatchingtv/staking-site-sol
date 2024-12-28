import React, { useState, useEffect } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PerformanceMonitor } from '../../utils/monitoring';
import './Dashboard.css';

const MonitoringDashboard = () => {
  const { connection } = useConnection();
  const [metrics, setMetrics] = useState({
    networkHealth: 'unknown',
    responseTime: 0,
    transactionCount: 0,
    errorRate: 0
  });

  useEffect(() => {
    const updateMetrics = async () => {
      const health = await PerformanceMonitor.checkNetworkHealth(connection);
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        networkHealth: health
      }));
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 30000);
    return () => clearInterval(interval);
  }, [connection]);

  return (
    <div className="monitoring-dashboard">
      <h2>System Status</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Network Health</h3>
          <div className={`status ${metrics.networkHealth}`}>
            {metrics.networkHealth}
          </div>
        </div>
        <div className="metric-card">
          <h3>Response Time</h3>
          <div className="value">{metrics.responseTime}ms</div>
        </div>
        <div className="metric-card">
          <h3>Transaction Count</h3>
          <div className="value">{metrics.transactionCount}</div>
        </div>
        <div className="metric-card">
          <h3>Error Rate</h3>
          <div className="value">{metrics.errorRate}%</div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard; 