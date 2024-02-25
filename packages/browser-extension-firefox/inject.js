(function () {
  // This script is injected in the tab but doesn't
  // have access to the page content.
  // It will inject the script "script.js" in the page and relay the
  // message to and from background.js

  class Connection {
    onDisconnect = (event) => {
      this.port = undefined;
      window.postMessage({
        __postero_disconnect__: true,
      });
    };

    onMessage = (m) => {
      window.postMessage({
        __postero_result__: m,
      });
    };

    connect() {
      if (this.port) {
        return this.port;
      }
      const port = browser.runtime.connect({ name: "port-from-cs" });
      port.onDisconnect.addListener(this.onDisconnect);
      port.onMessage.addListener(this.onMessage);
      this.port = port;
      return this.port;
    }

    postMessage(payload) {
      this.connect().postMessage(payload);
    }
  }

  const connection = new Connection();

  window.addEventListener("message", async (event) => {
    if (event.data.__postero__) {
      connection.postMessage(event.data.__postero__);
    }
  });
})();
