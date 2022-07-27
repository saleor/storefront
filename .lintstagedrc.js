module.exports = {
  "*.{js,ts,tsx}": [() => "pnpm lint:staged"],
  "*.{js,ts,tsx,css,md,json}": "prettier --write",
};
