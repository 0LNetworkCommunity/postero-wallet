const host = typeof chrome !== "undefined" ? chrome : browser;

const contentScriptPorts = new Map();

class Connection {
  onDisconnect = (event) => {
    this.nativePort = undefined;

    for (const port of contentScriptPorts.values()) {
      try {
        port.disconnect();
      } catch (error) {
        console.log(error);
      }
    }
    contentScriptPorts.clear();
  };

  onMessage = (response) => {
    if (response.id) {
      const responseId = response.id.split("::");
      const contentScriptId = parseInt(responseId.shift(), 10);

      const contentScriptPort = contentScriptPorts.get(contentScriptId);
      if (contentScriptPort) {
        contentScriptPort.postMessage({
          ...response,
          id: responseId.join("::"),
        });
      }
    } else {
      for (const contentScriptPort of contentScriptPorts.values()) {
        try {
          contentScriptPort.postMessage(response);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  connect() {
    if (this.nativePort) {
      return this.nativePort;
    }
    const nativePort = host.runtime.connectNative("app.postero.postero");
    nativePort.onDisconnect.addListener(this.onDisconnect);
    nativePort.onMessage.addListener(this.onMessage);
    this.nativePort = nativePort;
    return this.nativePort;
  }

  postMessage(payload) {
    this.connect().postMessage(payload);
  }
}

const connection = new Connection();

let contentScriptId = 0;

host.runtime.onConnect.addListener((contentScriptPort) => {
  const id = contentScriptId++;

  contentScriptPorts.set(id, contentScriptPort);

  contentScriptPort.onDisconnect.addListener((p) => {
    contentScriptPorts.delete(id);
    connection.postMessage({
      jsonrpc: "2.0",
      method: "__tab_disconnect__",
      params: [id],
    });
  });

  contentScriptPort.onMessage.addListener((message) => {
    const messageId = `${id}::${message.id}`;
    const payload = {
      ...message,
      id: messageId,
    };
    connection.postMessage(payload);
  });
});