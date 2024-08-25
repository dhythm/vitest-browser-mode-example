const createOldKey = (key: string) => `old/${key}`;
export const localStorage = {
  async getItem(key: string) {
    try {
      const value = window.localStorage.getItem(key);
      if (value === null) {
        const oldStoredValue = window.localStorage.getItem(createOldKey(key));
        if (oldStoredValue !== null) {
          this.removeItem(createOldKey(key));
          this.setItem(key, JSON.parse(oldStoredValue));
          return JSON.parse(oldStoredValue);
        } else {
          return null;
        }
      }
      const item = JSON.parse(value);
      return item;
    } catch {
      return null;
    }
  },
  async removeItem(key: string) {
    window.localStorage.removeItem(key);
  },
  async setItem<T>(key: string, value: T) {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  },
  subscribe<T>(
    callback: (event: { newValue: T | null; oldValue: T | null }) => void,
    key: string
  ) {
    const listener = (event: StorageEvent) => {
      if (event.storageArea === window.localStorage && event.key === key) {
        const newValue =
          event.newValue === null ? null : JSON.parse(event.newValue);
        const oldValue =
          event.oldValue === null ? null : JSON.parse(event.oldValue);
        callback({
          newValue,
          oldValue,
        });
      }
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  },
};
