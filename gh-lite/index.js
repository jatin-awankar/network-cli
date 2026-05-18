#!/usr/bin/env node

import { Command } from "commander";

import registerUserCommand from "./commands/user.js";

import registerReposCommand from "./commands/repos.js";

import registerAuthCommand from "./commands/auth.js";

import registerSearchCommand from "./commands/search.js";

import registerRepoCommand from "./commands/repo.js";

import registerIssuesCommand from "./commands/issues.js";

import registerPullsCommand from "./commands/pulls.js";

const program = new Command();

program.name("gh-lite").description("Mini GitHub CLI").version("1.0.0");

program.option("--debug", "Enable debug logging");

registerUserCommand(program);
registerReposCommand(program);
registerAuthCommand(program);
registerSearchCommand(program);
registerRepoCommand(program);
registerIssuesCommand(program);
registerPullsCommand(program);

program.parse();
