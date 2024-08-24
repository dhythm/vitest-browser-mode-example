import { chromeStorage } from "../chrome-storage";

test("chromeStorage.setItem", () => {
  chromeStorage.setItem("key1", "value1");
  chromeStorage.setItem("key2", "value2");
  expect(chrome.storage.local.set).toHaveBeenCalledWith(
    { key1: "value1" },
    expect.anything()
  );
  expect(chrome.storage.local.set).toHaveBeenCalledWith(
    { key2: "value2" },
    expect.anything()
  );
});

test("chromeStorage.subscribe", () => {
  const listeners = new Set<
    Parameters<typeof chrome.storage.onChanged.addListener>[0]
  >();

  chrome.storage.onChanged.addListener = vi
    .fn()
    .mockImplementation((callback) => listeners.add(callback));
  chrome.storage.onChanged.removeListener = vi
    .fn()
    .mockImplementation((callback) => listeners.delete(callback));

  const listener = vi.fn();
  const unsubscribe = chromeStorage.subscribe(listener, "test1");
  expect(listeners.size).toBe(1);

  listener.mockClear();
  listeners.forEach((_listener) =>
    _listener(
      {
        test1: {
          newValue: "new",
        },
      },
      "local"
    )
  );
  expect(listener).toHaveBeenCalledWith({
    newValue: "new",
    oldValue: null,
  });

  listener.mockClear();
  listeners.forEach((_listener) =>
    _listener(
      {
        test1: {
          newValue: "new",
          oldValue: "old",
        },
      },
      "local"
    )
  );
  expect(listener).toHaveBeenCalledWith({
    newValue: "new",
    oldValue: "old",
  });

  listener.mockClear();
  listeners.forEach((_listener) =>
    _listener(
      {
        test1: {
          oldValue: "old",
        },
      },
      "local"
    )
  );
  expect(listener).toHaveBeenCalledWith({
    newValue: null,
    oldValue: "old",
  });

  listener.mockClear();
  listeners.forEach((_listener) =>
    _listener(
      {
        test2: {
          newValue: "new",
          oldValue: "old",
        },
      },
      "local"
    )
  );
  expect(listener).toHaveBeenCalledTimes(0);

  listener.mockClear();
  unsubscribe();
  listeners.forEach((_listener) =>
    _listener(
      {
        test1: {
          newValue: "new",
          oldValue: "old",
        },
      },
      "local"
    )
  );
  expect(listener).toHaveBeenCalledTimes(0);
});
