export function translate<
  Obj extends {
    translation?:
      | { [TranslationKey in K]?: Obj[TranslationKey] | undefined | null }
      | undefined
      | null;
  },
  K extends keyof Obj
>(obj: Obj, key: K): Obj[K] {
  const result = obj.translation?.[key] || obj[key];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- typescript seems to think this assertions IS necessary
  return result as Obj[K];
}
