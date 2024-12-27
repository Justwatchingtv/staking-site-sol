import React, { useState } from 'react';
import { useStaking } from '../../context/StakingContext';
import RewardsDisplay from '../RewardsDisplay/RewardsDisplay';
import './NFTGallery.css';

const NFTCard = ({ nft }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { stakedNFTs } = useStaking();

  const isStaked = stakedNFTs.some(
    (stakedNft) => stakedNft.mint.toString() === nft.address.toString()
  );

  const handleStakeAction = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement staking logic
      console.log('Staking action for:', nft.address.toString());
    } catch (error) {
      console.error('Error during stake action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`nft-card ${isStaked ? 'staked' : ''}`}>
      <div className="nft-image-container">
        <img 
          src={nft.json?.image || 'placeholder.png'} 
          alt={nft.json?.name || 'NFT'} 
          className="nft-image"
        />
      </div>
      <div className="nft-info">
        <h3>{nft.json?.name || 'Unnamed NFT'}</h3>
        <p className="nft-status">
          Status: {isStaked ? 'Staked' : 'Unstaked'}
        </p>
        {isStaked && <RewardsDisplay nft={nft} />}
        <button 
          onClick={handleStakeAction}
          disabled={isLoading}
          className="stake-button"
        >
          {isLoading ? 'Processing...' : isStaked ? 'Unstake' : 'Stake'}
        </button>
      </div>
    </div>
  );
};

export default NFTCard; 