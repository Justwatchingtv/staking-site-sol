import React, { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import './WalletConnect.css';

const WalletConnect = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const getBalance = async () => {
      try {
        if (publicKey) {
          const bal = await connection.getBalance(publicKey);
          if (isMounted) {
            setBalance(bal / LAMPORTS_PER_SOL);
          }
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    getBalance();
    const intervalId = setInterval(getBalance, 10000); // Update every 10 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [publicKey, connection]);

  return (
    <div className="wallet-connect">
      <WalletMultiButton />
      {publicKey && (
        <>
          <div className="wallet-address">
            {publicKey.toString().slice(0, 4)}...
            {publicKey.toString().slice(-4)}
          </div>
          <div className="wallet-balance">
            {balance.toFixed(2)} SOL
          </div>
        </>
      )}
    </div>
  );
};

export default WalletConnect; 