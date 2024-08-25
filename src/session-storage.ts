export const sessionStorage = {
  async getItem(key: string) {
    try {
      const value = window.sessionStorage.getItem(key);
      if (value === null) {
        return null;
      }
      const item = JSON.parse(value);
      return item;
    } catch {
      return null;
    }
  },
  async removeItem(key: string) {
    window.sessionStorage.removeItem(key);
  },
  async setItem<T>(key: string, value: T) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
    return value;
  },
  subscribe<T>(
    callback: (event: { newValue: T | null; oldValue: T | null }) => void,
    key: string
  ) {
    const listener = (event: StorageEvent) => {
      if (event.storageArea === window.sessionStorage && event.key === key) {
        const newValue =
          event.newValue === null ? null : JSON.parse(event.newValue);
        const oldValue =
          event.oldValue === null ? null : JSON.parse(event.oldValue);
        callback({ newValue, oldValue });
      }
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  },
};
