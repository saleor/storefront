import "client-only";

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  const stickyValue = localStorage.getItem(key);
  return stickyValue !== null && typeof stickyValue !== "undefined"
    ? (JSON.parse(stickyValue) as T)
    : defaultValue;
}

export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
