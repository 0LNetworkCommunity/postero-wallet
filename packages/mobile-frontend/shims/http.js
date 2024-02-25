module.exports = {
  IncomingMessage: {
    prototype: null,
  },
  ServerResponse: {
    prototype: null,
  },
  createServer: () => {
    return {
      on: () => {},
    };
  }
};
