module.exports = {
  apps: [{
    name: 'betterbun-api',
    script: 'src/index.js',
    exec_mode: 'cluster_mode',
    instances: 1,
    wait_ready: true,
    listen_timeout: 10000,
    kill_timeout: 5000,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    ignore_watch: ['node_modules'],
    watch_options: {
      followSymlinks: false
    }
  }]
};
