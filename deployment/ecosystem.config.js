module.exports = {
  apps: [
    {
      name: "Jupiter",
      script: "./index.js",
      cwd: "./Jupiter",
      watch: false,
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "Europa",
      script: "./index.js",
      cwd: "./Europa",
      watch: false,
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
