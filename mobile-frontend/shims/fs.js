module.exports = {
  readFile: () => {
    throw new Error('fs.readFile unsupported');
  },
};
