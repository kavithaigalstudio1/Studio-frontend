// config.js
window.API_URL = window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.') ||
    window.location.hostname.startsWith('172.') ||
    window.location.hostname.startsWith('10.')
    ? `http://${window.location.hostname}:5000`
    : "https://studio-backend-r4n9.onrender.com";

// Global Image Cache with Persistence Hydration (Zero-Empty State)
const getPersisted = (key) => {
    try {
        const saved = localStorage.getItem(`ks_cache_${key}`);
        return saved ? JSON.parse(saved) : null;
    } catch { return null; }
};

window.globalAssetCache = {
    gallery: null,
    portfolio: {},
    montages: null,
    reviews: null,
    reviewVideos: null,
    logo: './public/logo copy.png'
};
window.el = React.createElement;
