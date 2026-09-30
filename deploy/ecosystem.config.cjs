// pm2: menjaga aplikasi tetap hidup dan menyalakannya lagi setelah crash/reboot.
module.exports = {
  apps: [
    {
      name: 'artic',
      script: './deploy/start.sh',
      interpreter: 'bash',
      autorestart: true,
      max_memory_restart: '700M',
      kill_timeout: 8000,
    },
  ],
}
