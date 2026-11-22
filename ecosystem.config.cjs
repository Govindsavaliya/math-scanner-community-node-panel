// PM2 process definitions. Run one per checkout, after `npm run build` (production) or `npm run build:staging`:
//   pm2 start ecosystem.config.cjs --only math-scanner-community-node-panel
//   pm2 start ecosystem.config.cjs --only math-scanner-community-node-panel-staging
const serveBuild = (port) => ({
  script: "/usr/bin/bash",
  args: ["-c", `serve -s build -l ${port}`],
  interpreter: "none",
});

module.exports = {
  apps: [
    { name: "math-scanner-community-node-panel", ...serveBuild(3000) },
    { name: "math-scanner-community-node-panel-staging", ...serveBuild(3001) },
  ],
};
