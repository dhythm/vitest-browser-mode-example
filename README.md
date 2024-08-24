# Vitest Browser Mode Example

## Setting up

Create a codebase,

```sh
npm create vite@latest
cd vitest-browser-mode-example
npm install
```

Install vitest and @vitest/browser

```sh
touch tsconfig.spec.json
touch vitest.setup.ts
sh -c 'mkdir -p "$(dirname "$0")" && touch "$0"' `echo src/__tests__/chrome.spec.ts`
npm install -D vitest @vitest/browser playwright
npm install -D vitest-chrome
```
