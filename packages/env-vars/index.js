const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const findConfig = require("find-config");

// Load env variables from root of monorepo
dotenv.config({ path: findConfig(".env", { cwd: ".." }) });
// Load env variables from apps/checkout
const env = dotenv.config();
// Replace $ in .env with loaded env variables
dotenvExpand.expand(env);
