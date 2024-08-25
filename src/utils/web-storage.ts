export const parseWebStorageValue = (value: string | null) => {
  if (value === null) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};
