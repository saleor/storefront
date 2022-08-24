export function translate<
  Obj extends {
    translation?:
      | { [TranslationKey in K]?: Obj[TranslationKey] | undefined | null }
      | undefined
      | null;
  },
  K extends keyof Obj
>(obj: Obj, key: K): Obj[K] {
  return (obj.translation?.[key] || obj[key]) as Obj[K];
}
