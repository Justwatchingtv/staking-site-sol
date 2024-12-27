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

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!publicKey) return;
      
      setLoading(true);
      try {
        const metaplex = new Metaplex(connection);
        const nfts = await metaplex
          .nfts()
          .findAllByOwner({ owner: publicKey });
        
        setNfts(nfts);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [publicKey, connection]);

  if (!publicKey) {
    return (
      <div className="nft-gallery-container">
        <p>Please connect your wallet to view your NFTs</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="nft-gallery-container">
        <p>Loading your NFTs...</p>
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
          <p>No NFTs found in your wallet</p>
        )}
      </div>
    </div>
  );
};

export default NFTGallery; 