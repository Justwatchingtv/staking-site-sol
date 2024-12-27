import React, { useMemo } from 'react';
import './App.css';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import WalletConnect from './components/WalletConnect/WalletConnect';
import NFTGallery from './components/NFTGallery/NFTGallery';
import AdminPanel from './components/AdminPanel/AdminPanel';
import { StakingProvider } from './context/StakingContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TransactionHistory from './components/TransactionHistory/TransactionHistory';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

window.Buffer = window.Buffer || require('buffer').Buffer;

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <StakingProvider>
            <div className="App">
              <header className="App-header">
                <h1>NFT Staking Platform</h1>
                <WalletConnect />
              </header>
              <main className="App-main">
                <AdminPanel />
                <NFTGallery />
                <TransactionHistory />
              </main>
            </div>
            <ToastContainer />
          </StakingProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
