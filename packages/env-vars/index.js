const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const findConfig = require("find-config");
const fs = require("fs");

// Note - env variables don't override each other
// if they have been loaded, so the order of loading is flipped from
// default next.js behavior (first .env.local, then .env.development, then .env)

// Load env variables from apps/**/.env.local
let localEnv = {};
if (fs.existsSync(".env.local")) {
  localEnv = dotenv.config({ path: ".env.local" });
}

// Load env variables from apps/**/.env.developmen
let developmentEnv = {};
if (fs.existsSync(".env.development") && process.env.NODE_ENV === "development") {
  developmentEnv = dotenv.config({path: ".env.development"})
}

// Load env variables from apps/**/.env
const env = dotenv.config();

// Load env variables from root of monorepo
const rootEnvLocalPath = findConfig(".env.local", { cwd: ".." });
let rootEnvLocal;
if (fs.existsSync(rootEnvLocalPath)) {
  rootEnvLocal = dotenv.config({ path: rootEnvLocalPath });
}
const rootEnv = dotenv.config({ path: findConfig(".env", { cwd: ".." }) });

// Merge all envs into single object - see the note about order from top of the file
const envs = {
  // project envs
  ...localEnv?.parsed,
  ...developmentEnv?.parsed,
  ...env?.parsed,

  // monorepo envs
  ...rootEnvLocal?.parsed,
  ...rootEnv?.parsed,
}

// Replace $ in variable values with other loaded env variables
// For example:
// .env
//   MY_ENV=123
// .env.local
//   OTHER_ENV=$MY_ENV
// means that OTHER_ENV=123
const expandedEnvs = dotenvExpand.expand({
  parsed: envs
})

module.exports = expandedEnvs
