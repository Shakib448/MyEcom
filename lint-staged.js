module.exports = {
  "*.{js,jsx,ts,tsx}": ["server:test", () => "tsc-files --noEmit"],
};
