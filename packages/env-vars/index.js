const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const findConfig = require("find-config");

// Load env variables from root of monorepo
dotenv.config({ path: findConfig(".env.local", { cwd: ".." }) });
dotenv.config({ path: findConfig(".env", { cwd: ".." }) });

// Load env variables from apps/checkout
// Replace $ in .env with loaded env variables
dotenvExpand.expand(dotenv.config({path: '.env.local'}));
dotenvExpand.expand(dotenv.config({path: '.env'}));
