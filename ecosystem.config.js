module.exports = {
  apps: [{
    name: 'mokin-recruit',
    script: 'npm',
    args: 'start',
    cwd: './client',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=2048',
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    merge_logs: true,
    time: true,
    kill_timeout: 5000,
    listen_timeout: 5000,
    max_restarts: 10,
    min_uptime: '10s',
    cron_restart: '0 3 * * *',
  }]
};