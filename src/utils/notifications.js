import { toast } from 'react-toastify';

export const notify = ({ type, message, txid }) => {
  const content = (
    <div>
      {message}
      {txid && (
        <a 
          href={`https://explorer.solana.com/tx/${txid}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Explorer
        </a>
      )}
    </div>
  );

  toast[type](content, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  });
}; 