import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import './WalletConnect.css';

const WalletConnect = () => {
  const { publicKey } = useWallet();

  return (
    <div className="wallet-connect">
      <WalletMultiButton />
      {publicKey && (
        <div className="wallet-address">
          Connected: {publicKey.toString().slice(0, 4)}...
          {publicKey.toString().slice(-4)}
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 