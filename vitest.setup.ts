import { vi } from "vitest";
import { chrome } from "vitest-chrome";

//github.com/clarkbw/jest-webextension-mock/blob/cdf594aae40d1cb7b26638ec5a2608ebf65e27db/src/storage.js#L74
chrome.storage.local.set = vi.fn().mockImplementation((_, callback) => {
  if (callback !== undefined) {
    callback();
  }
  return Promise.resolve();
});

vi.stubGlobal("chrome", chrome);
