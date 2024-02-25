const start = Date.now();

module.exports = {
  performance: {
    now: () => {
      return (Date.now() - start);
    },
  }
};
