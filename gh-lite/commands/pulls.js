import ora from "ora";

import chalk from "chalk";

import { githubRequest } from "../services/githubApi.js";

import { createTable } from "../utils/table.js";

export default function (program) {
  program
    .command("pulls")
    .argument("<repository>")
    .description("List pull requests")
    .action(async (repository) => {
      const spinner = ora("Fetching pull requests...").start();

      try {
        const pulls = await githubRequest(`/repos/${repository}/pulls`);

        spinner.stop();

        const table = createTable(["Pull Request", "State", "Author"]);

        pulls.slice(0, 10).forEach((pull) => {
          table.push([chalk.blue(pull.title), pull.state, pull.user.login]);
        });

        console.log(table.toString());
      } catch (error) {
        spinner.fail(error.message);
      }
    });
}
