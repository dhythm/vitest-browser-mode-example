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
  test("setItem", async () => {
    await storage.setItem(key1, value1);
    await storage.setItem(key2, value2);
    expect(nativeStorage.setItem).toHaveBeenCalledWith(
      key1,
      JSON.stringify(value1)
    );
    expect(nativeStorage.setItem).toHaveBeenCalledWith(
      key2,
      JSON.stringify(value2)
    );
  });
  test("getItem", async () => {});
  test("removeItem", async () => {});
  test("subscribe", async () => {});
});

test("Replace an old value in localStorage with a new value", async () => {});
