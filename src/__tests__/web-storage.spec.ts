import { localStorage } from "../local-storage";
import { sessionStorage } from "../session-storage";

const key1 = "key1";
const key2 = "key2";
const value1 = "value1";
const value2 = "value2";

describe.each([
  ["localStorage", localStorage, window.localStorage],
  ["sessionStorage", sessionStorage, window.sessionStorage],
])("%s", (_, storage, nativeStorage) => {
  const actualSetItem = nativeStorage.setItem;
  nativeStorage.setItem = vi.fn().mockImplementation(actualSetItem);

  test("setItem", async () => {
    await storage.setItem(key1, value1);
    await storage.setItem(key2, value2);
    console.log(nativeStorage);
    expect(nativeStorage.setItem).toHaveBeenCalledWith(
      key1,
      JSON.stringify(value1)
    );
    expect(nativeStorage.setItem).toHaveBeenCalledWith(
      key2,
      JSON.stringify(value2)
    );
  });
  test("getItem", async () => {
    await storage.setItem(key1, value1);
    await storage.setItem(key2, value2);
    const storedValue1 = await storage.getItem(key1);
    const storedValue2 = await storage.getItem(key2);
    expect(storedValue1).toBe(value1);
    expect(storedValue2).toBe(value2);
  });
  test("removeItem", async () => {
    await storage.setItem(key1, value1);
    await storage.removeItem(key1);
    const storedValue = await storage.getItem(key1);
    expect(storedValue).toBe(null);
  });
  test("subscribe", async () => {
    const listener = vi.fn();
    const unsubscribe = storage.subscribe(listener, "test1");

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "test1",
        newValue: null,
        oldValue: "",
        storageArea: nativeStorage,
      })
    );
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ newValue: null, oldValue: "" });

    listener.mockClear();
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "test2",
        storageArea: nativeStorage,
      })
    );
    expect(listener).toHaveBeenCalledTimes(0);

    unsubscribe();
  });

  test("check for broken value", async () => {
    nativeStorage.setItem("broken", "{broken:");
    const storedValue = await storage.getItem("broken");
    expect(storedValue).toBe(null);
  });
});

test("Replace an old value in localStorage with a new value", async () => {
  window.localStorage.setItem("old/key", JSON.stringify("oldValue"));
  const storedValue1 = await localStorage.getItem("key");
  expect(window.localStorage.getItem("old/key")).toEqual(null);
  expect(storedValue1).toEqual("oldValue");

  const storageValue2 = await localStorage.getItem("key");
  expect(storageValue2).toEqual("oldValue");
});
