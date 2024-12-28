import { toast } from 'react-toastify';

export const NotificationTypes = {
  STAKE_SUCCESS: 'STAKE_SUCCESS',
  UNSTAKE_SUCCESS: 'UNSTAKE_SUCCESS',
  CLAIM_SUCCESS: 'CLAIM_SUCCESS',
  ERROR: 'ERROR'
};

export const showNotification = (type, message) => {
  toast[type === 'ERROR' ? 'error' : 'success'](message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  });
}; 