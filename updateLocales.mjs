// @ts-check

import asserts from "node:assert";
import Path from "node:path";
import Fs from "node:fs/promises";

/**
 *
 * @param {string} path
 * @returns {Promise<any>}
 */
const readJson = async (path) => JSON.parse(await Fs.readFile(path, "utf8"));

const defaultLocalePath = (() => {
  const [_node, _path, defaultLocalePathTmp] = process.argv;
  asserts(defaultLocalePathTmp, "Please provide a path to the default language");
  return Path.normalize(defaultLocalePathTmp);
})();

const localesDirPath = Path.dirname(defaultLocalePath);

const localesDir = await Fs.readdir(localesDirPath);
const otherLocalesPaths = localesDir
  .map((locale) => Path.join(localesDirPath, locale))
  .filter((path) => path !== defaultLocalePath);

const defaultLocale = await readJson(defaultLocalePath);
const defaultLocaleKeys = Object.keys(defaultLocale);

for (const otherLocalePath of otherLocalesPaths) {
  console.log(`Processing ${otherLocalePath}…`);

  const otherLocale = await readJson(otherLocalePath);
  const missingKeys = defaultLocaleKeys.filter((key) => !otherLocale[key]);
  const extraKeys = Object.keys(otherLocale).filter((key) => !defaultLocale[key]);

  console.log(`Extra ${extraKeys.length} keys. Removing…`);
  console.log(`Missing ${missingKeys.length} keys. Adding…`);

  const newOtherLocale = Object.fromEntries(
    [
      ...Object.entries(otherLocale)
        // remove unused keys
        .filter(([key]) => defaultLocaleKeys.includes(key)),
      ...missingKeys.map((key) => [
        key,
        {
          ...defaultLocale[key],
          "@TODO": "Please translate this",
        },
      ]),
    ].sort(([a], [b]) => defaultLocaleKeys.indexOf(a) - defaultLocaleKeys.indexOf(b))
  );

  await Fs.writeFile(Path.resolve(otherLocalePath), JSON.stringify(newOtherLocale, null, 2));
}
