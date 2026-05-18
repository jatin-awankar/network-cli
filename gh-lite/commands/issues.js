import ora from "ora";

import chalk from "chalk";

import { githubRequest } from "../services/githubApi.js";

import { createTable } from "../utils/table.js";

export default function (program) {
  program
    .command("issues")
    .argument("<repository>")
    .description("List repository issues")
    .action(async (repository) => {
      const spinner = ora("Fetching issues...").start();

      try {
        const issues = await githubRequest(`/repos/${repository}/issues`);

        spinner.stop();

        const table = createTable(["Issue", "State", "Author"]);

        issues.slice(0, 10).forEach((issue) => {
          table.push([chalk.blue(issue.title), issue.state, issue.user.login]);
        });

        console.log(table.toString());
      } catch (error) {
        spinner.fail(error.message);
      }
    });
}
