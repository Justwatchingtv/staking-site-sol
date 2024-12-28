import { notify } from './notifications';

export const monitorTransaction = async (
  connection,
  signature,
  description = 'Transaction'
) => {
  try {
    const latestBlockhash = await connection.getLatestBlockhash();
    
    await connection.confirmTransaction({
      signature,
      ...latestBlockhash
    }, 'confirmed');

    notify({
      type: 'success',
      message: `${description} successful!`,
      txid: signature
    });

    return true;
  } catch (error) {
    notify({
      type: 'error',
      message: `${description} failed: ${error.message}`,
      txid: signature
    });
    return false;
  }
}; 