import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Metaplex } from '@metaplex-foundation/js';
import NFTCard from './NFTCard';
import './NFTGallery.css';

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
    return (
      <div className="nft-gallery-container">
        <div className="nft-message">
          <p>Please connect your wallet to view your NFTs</p>
          <span className="nft-submessage">
            Connect using the button in the top right
          </span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="nft-gallery-container">
        <div className="nft-loading">
          <div className="loading-spinner"></div>
          <p>Loading your NFTs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nft-gallery-container">
        <div className="nft-error">
          <p>Error loading NFTs: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nft-gallery-container">
      <h2>Your NFTs</h2>
      <div className="nft-grid">
        {nfts.length > 0 ? (
          nfts.map((nft) => (
            <NFTCard 
              key={nft.address.toString()} 
              nft={nft} 
            />
          ))
        ) : (
          <div className="no-nfts-message">
            <p>No NFTs found in your wallet</p>
            <span className="nft-submessage">
              Transfer some NFTs to this wallet to get started
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTGallery; 