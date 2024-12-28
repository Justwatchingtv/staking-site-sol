import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';

export const transferNFTToVault = async (
  connection,
  wallet,
  nftMint,
  vaultAddress
) => {
  const tokenAccount = await Token.getAssociatedTokenAddress(
    nftMint,
    wallet.publicKey
  );

  const vaultTokenAccount = await Token.getAssociatedTokenAddress(
    nftMint,
    vaultAddress
  );

  const transaction = new Transaction().add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      tokenAccount,
      vaultTokenAccount,
      wallet.publicKey,
      [],
      1
    )
  );

  return transaction;
}; 