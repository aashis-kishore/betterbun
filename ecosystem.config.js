module.exports = {
  apps: [{
    name: 'betterbun-api',
    script: 'server.js',
    exec_mode: 'cluster_mode',
    instances: 0,
    wait_ready: true,
    listen_timeout: 10000,
    kill_timeout: 5000,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
