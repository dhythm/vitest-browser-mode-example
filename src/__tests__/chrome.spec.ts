test("chrome is mocked", () => {
  expect(chrome).toBeDefined();
  expect(window.chrome).toBeDefined();
  expect(chrome.storage.local).toBeDefined();
});

test("chrome api events", () => {
  const listenerMock = vi.fn();
  const sendResponseMock = vi.fn();

  chrome.runtime.onMessage.addListener(listenerMock);

  expect(listenerMock).not.toBeCalled();
  expect(chrome.runtime.onMessage.hasListeners()).toBe(true);

  chrome.runtime.onMessage.callListeners(
    { greeting: "hello" },
    {},
    sendResponseMock
  );

  expect(listenerMock).toBeCalledWith(
    { greeting: "hello" },
    {},
    sendResponseMock
  );
  expect(sendResponseMock).not.toBeCalled();
});

test("chrome api functions", () => {
  const manifest = {
    name: "my chrome extension",
    manifest_version: 2,
    version: "1.0.0",
  };

  chrome.runtime.getManifest.mockImplementation(() => manifest);

  expect(chrome.runtime.getManifest()).toEqual(manifest);
  expect(chrome.runtime.getManifest).toBeCalled();
});

test("chrome api functions with callback", () => {
  const message = { greeting: "hello?" };
  const response = { greeting: "here I am" };
  const callbackMock = vi.fn();

  chrome.runtime.sendMessage.mockImplementation((message, callback) => {
    callback(response);
  });

  chrome.runtime.sendMessage(message, callbackMock);

  expect(chrome.runtime.sendMessage).toBeCalledWith(message, callbackMock);
  expect(callbackMock).toBeCalledWith(response);
});

test("chrome api functions with lastError", () => {
  const message = { greeting: "hello?" };
  const response = { greeting: "here I am" };

  // lastError setup
  const lastErrorMessage = "this is an error";
  const lastErrorGetter = vi.fn(() => lastErrorMessage);
  const lastError = {
    get message() {
      return lastErrorGetter();
    },
  };

  // mock implementation
  chrome.runtime.sendMessage.mockImplementation((message, callback) => {
    chrome.runtime.lastError = lastError;

    callback(response);

    // lastError is undefined outside of a callback
    delete chrome.runtime.lastError;
  });

  // callback implementation
  const lastErrorMock = vi.fn();
  const callbackMock = vi.fn(() => {
    if (chrome.runtime.lastError) {
      lastErrorMock(chrome.runtime.lastError.message);
    }
  });

  // send a message
  chrome.runtime.sendMessage(message, callbackMock);

  expect(callbackMock).toBeCalledWith(response);
  expect(lastErrorGetter).toBeCalled();
  expect(lastErrorMock).toBeCalledWith(lastErrorMessage);

  // lastError has been cleared
  expect(chrome.runtime.lastError).toBeUndefined();
});
