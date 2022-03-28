type Translated = {
  translation?: object | undefined | null;
};

export function translate<T extends Translated, K extends keyof T>(obj: T, key: K): T[K] {
  // TODO: better types
  // @ts-ignore
  return obj.translation?.[key] || obj[key];
}

export default translate;
