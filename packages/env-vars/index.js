const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const findConfig = require("find-config");
const fs = require("fs");

// Note - env variables don't override each other
// if they have been loaded, so the order of loading is flipped from
// default next.js behavior (first .env.loca, then .env)

// Load env variables from apps/**/.env.local
let localEnv;
if (fs.existsSync(".env.local")) {
  localEnv = dotenv.config({ path: ".env.local" });
}

// Load env variables from apps/**/.env
const env = dotenv.config();

// Load env variables from root of monorepo
const rootEnvLocal = findConfig(".env.local", { cwd: ".." });
if (fs.existsSync(rootEnvLocal)) {
  dotenv.config({ path: rootEnvLocal });
}
dotenv.config({ path: findConfig(".env", { cwd: ".." }) });

// Replace $ in .env and .env.local with loaded env variables from root of monorepo
if (localEnv) {
  dotenvExpand.expand(localEnv);
}
dotenvExpand.expand(env);
