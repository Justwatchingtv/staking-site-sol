import { notify } from './notifications';

export const monitorTransaction = async (
  connection,
  signature,
  description = 'Transaction'
) => {
  try {
    const latestBlockhash = await connection.getLatestBlockhash();
    
    notify({
      type: 'info',
      message: `${description} Processing...`,
      txid: signature
    });

    await connection.confirmTransaction({
      signature,
      ...latestBlockhash
    }, 'confirmed');

    notify({
      type: 'success',
      message: `${description} Successful!`,
      txid: signature
    });

    return true;
  } catch (error) {
    notify({
      type: 'error',
      message: `${description} Failed: ${error.message}`,
      txid: signature
    });
    
    return false;
  }
}; 