import React, { useState, useEffect, useMemo } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { fetchTransactionHistory } from '../../utils/transactionHistory';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'stake', 'unstake', 'claim'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount', 'type'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  useEffect(() => {
    const loadTransactions = async () => {
      if (!publicKey) return;
      
      setLoading(true);
      try {
        const history = await fetchTransactionHistory(
          connection,
          publicKey,
          process.env.REACT_APP_PROGRAM_ID
        );
        setTransactions(history);
      } catch (error) {
        console.error('Error loading transaction history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [publicKey, connection]);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;
    
    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(tx => tx.type === filter);
    }

    // Apply sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortOrder === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp;
        case 'amount':
          return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
        case 'type':
          return sortOrder === 'desc' ? 
            b.type.localeCompare(a.type) : 
            a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });
  }, [transactions, filter, sortBy, sortOrder]);

  if (loading) {
    return <div className="transaction-history loading">Loading history...</div>;
  }

  return (
    <div className="transaction-history">
      <div className="transaction-controls">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="transaction-filter"
        >
          <option value="all">All Transactions</option>
          <option value="stake">Stake</option>
          <option value="unstake">Unstake</option>
          <option value="claim">Claim</option>
        </select>

        <div className="sort-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="transaction-sort"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="type">Type</option>
          </select>
          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="sort-order-toggle"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="transaction-list">
        {filteredAndSortedTransactions.map((tx) => (
          <div key={tx.signature} className={`transaction-item ${tx.status}`}>
            <div className="transaction-info">
              <span className="transaction-type">{tx.type}</span>
              <span className="transaction-amount">{tx.amount} tokens</span>
            </div>
            <div className="transaction-meta">
              <span className="transaction-date">
                {new Date(tx.timestamp * 1000).toLocaleString()}
              </span>
              <a
                href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="transaction-link"
              >
                View
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory; 