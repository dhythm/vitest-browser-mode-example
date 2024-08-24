type Item<T> = {
  [key: string]: T;
};

const createChromeStorage = () => {
  return {
    async getItem<T, U = unknown>(key: string) {
      type Result = U extends undefined ? U : T;
      const value: { [key: string]: Result } = await new Promise(
        (resolve, reject) => {
          try {
            chrome.storage.local.get(key, resolve);
          } catch (e) {
            reject(e);
          }
        }
      );

      const item = value[key];
      if (item === undefined) {
        return null;
      }

      return item;
    },
    async removeItem(key: string) {
      return new Promise((resolve, reject) => {
        try {
          chrome.storage.local.remove(key, () => {
            resolve();
          });
        } catch (e) {
          reject(e);
        }
      });
    },
    async setItem<T>(key: string, value: T) {
      const items: Item<T> = { [key]: value };
      return await new Promise<T>((resolve, reject) => {
        try {
          chrome.storage.local.set(items, () => {
            resolve(value);
          });
        } catch (e) {
          reject(e);
        }
      });
    },
    subscribe<T>(
      callback: (event: { newValue: T | null; oldValue: T | null }) => void,
      key: string
    ) {
      const listener: Parameters<
        typeof chrome.storage.onChanged.addListener
      >[0] = (changes, namespace) => {
        if (namespace === "local" && key in changes) {
          callback({
            newValue: changes[key].newValue ?? null,
            oldValue: changes[key].oldValue ?? null,
          });
        }
      };
      chrome.storage.onChanged.addListener(listener);
      return () => {
        chrome.storage.onChanged.removeListener(listener);
      };
    },
  };
};

export const chromeStorage = createChromeStorage();
