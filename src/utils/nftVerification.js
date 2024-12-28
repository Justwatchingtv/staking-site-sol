import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { PublicKey } from '@solana/web3.js';

export const verifyNFTCollection = async (
  connection,
  nftMint,
  collectionAddress
) => {
  const metadataPDA = await Metadata.getPDA(nftMint);
  const metadata = await Metadata.load(connection, metadataPDA);
  
  return metadata.data.collection?.key.equals(new PublicKey(collectionAddress));
}; 