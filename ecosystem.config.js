module.exports = {
  apps: [{
    name: 'family-accounting',
    script: 'backend/dist/app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      MONGODB_URI: process.env.MONGODB_URI,
      JWT_SECRET: process.env.JWT_SECRET,
      MIMO_API_KEY: process.env.MIMO_API_KEY,
      MIMO_BASE_URL: process.env.MIMO_BASE_URL,
      MIMO_MODEL: process.env.MIMO_MODEL,
      MIMO_ASR_MODEL: process.env.MIMO_ASR_MODEL,
    }
  }]
}; 