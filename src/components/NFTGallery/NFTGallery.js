import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Metaplex } from '@metaplex-foundation/js';
import NFTCard from './NFTCard';
import './NFTGallery.css';

const LoadingSkeleton = () => (
  <div className="nft-loading-grid">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="nft-skeleton">
        <div className="skeleton-image" />
        <div className="skeleton-text" />
        <div className="skeleton-text short" />
      </div>
    ))}
  </div>
);

const EmptyState = ({ type }) => {
  const messages = {
    noWallet: {
      icon: '👛',
      title: 'Connect Your Wallet',
      description: 'Connect your wallet to view your NFTs',
      action: 'Connect Wallet'
    },
    noNFTs: {
      icon: '🖼️',
      title: 'No NFTs Found',
      description: 'You don\'t have any NFTs in your wallet yet',
      action: 'Learn How to Get NFTs'
    },
    error: {
      icon: '⚠️',
      title: 'Something Went Wrong',
      description: 'There was an error loading your NFTs',
      action: 'Try Again'
    }
  };

  const content = messages[type];

  return (
    <div className="empty-state">
      <div className="empty-state-icon">{content.icon}</div>
      <h3>{content.title}</h3>
      <p className="empty-state-text">{content.description}</p>
      <button className="empty-state-action">
        {content.action}
      </button>
    </div>
  );
};

const NFTGallery = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!publicKey) return;
      
      setLoading(true);
      setError(null);

      try {
        const metaplex = new Metaplex(connection);
        const nfts = await metaplex
          .nfts()
          .findAllByOwner({ owner: publicKey });
        
        setNfts(nfts);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setError(error.message || 'Failed to fetch NFTs');
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [publicKey, connection]);

  if (!publicKey) {
    return <EmptyState type="noWallet" />;
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <EmptyState type="error" />;
  }

  if (!nfts.length) {
    return <EmptyState type="noNFTs" />;
  }

  return (
    <div className="nft-gallery-container">
      <h2>Your NFTs</h2>
      <div className="nft-grid">
        {nfts.map((nft) => (
          <NFTCard 
            key={nft.address.toString()} 
            nft={nft} 
          />
        ))}
      </div>
    </div>
  );
};

export default NFTGallery; 