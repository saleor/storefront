const { exec, execSync } = require("child_process");

execSync("pnpm translations");

const resp = execSync(
  'curl -X POST https://api.poeditor.com/v2/projects/upload -F api_token="1b160142e3b49e26d1c5e6626b42de4b" -F id="501227" -F updating="terms_translations" -F language="en-US" -F file=@"locale/en-US.json"'
);

console.log(JSON.parse(resp.toString("UTF8")));

const languageMap = [
  {
    poeCode: "pl",
    fileName: "pl-PL.json",
  },
];

languageMap.forEach((language) => {
  const respLanguages = execSync(
    'curl -X POST https://api.poeditor.com/v2/projects/export -F api_token="1b160142e3b49e26d1c5e6626b42de4b" -F id="501227" -F language="pl" -F type="key_value_json"'
  );

  const fileURL = JSON.parse(respLanguages.toString("UTF8")).result.url;
  execSync(`curl ${fileURL} --output locale/${language.fileName}`);
});
