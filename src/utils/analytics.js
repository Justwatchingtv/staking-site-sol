import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN;
mixpanel.init(MIXPANEL_TOKEN);

export const Analytics = {
  trackEvent: (eventName, properties = {}) => {
    try {
      mixpanel.track(eventName, {
        ...properties,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  },

  trackError: (error) => {
    try {
      mixpanel.track('Error', {
        type: error.type || 'UNKNOWN',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Analytics error:', err);
    }
  },

  setUser: (wallet) => {
    try {
      mixpanel.identify(wallet.toString());
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
}; 