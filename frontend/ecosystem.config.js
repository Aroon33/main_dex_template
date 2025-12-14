module.exports = {
  apps: [
    {
      name: "perpx-frontend",
      cwd: "/home/deploy/dex_template_com/frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3010",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3010,
      },
    },
  ],
};
