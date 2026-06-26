// ╔══════════════════════════════════════════════════════════╗
// ║  Coca-Cola Landing Page — PM2 Config (Ejemplo)          ║
// ║  Copia y personaliza:                                   ║
// ║  cp ecosystem.config.example.cjs ecosystem.config.cjs   ║
// ╚══════════════════════════════════════════════════════════╝

module.exports = {
  apps: [
    {
      name: 'coca-cola-backend',
      script: 'npm',
      args: 'run start --workspace=backend',
      env: {
        NODE_ENV: 'production',
        PORT: 4001, // ← Debe coincidir con el PORT del .env y nginx.conf
      },
    },
  ],
};
