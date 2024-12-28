import { createContext, useContext, useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { StakingProgram } from '../programs/StakingProgram';

const StakingProgramContext = createContext({});

export function StakingProgramProvider({ children }) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [program, setProgram] = useState(null);
  const [stakedNFTs, setStakedNFTs] = useState([]);
  const [pendingRewards, setPendingRewards] = useState(0);

  // Initialize program
  useEffect(() => {
    if (wallet.publicKey) {
      // Initialize program with wallet
    }
  }, [wallet.publicKey]);

  // Fetch staked NFTs
  useEffect(() => {
    if (program && wallet.publicKey) {
      // Fetch user's staked NFTs
    }
  }, [program, wallet.publicKey]);

  return (
    <StakingProgramContext.Provider
      value={{
        program,
        stakedNFTs,
        pendingRewards,
        // Add methods
      }}
    >
      {children}
    </StakingProgramContext.Provider>
  );
} 