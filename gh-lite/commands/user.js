import ora from "ora";

import { githubRequest } from "../services/githubApi.js";

import chalk from "chalk";

const log = console.log;

export default function (program) {
  program
    .command("user")
    .argument("<username>")
    .description("Get GitHub user info")
    .action(async (username) => {
      const spinner = ora("Fetching user...").start();

      try {
        const user = await githubRequest(`/users/${username}`);

        spinner.stop();

        log();

        log(chalk.blue(`👤 ${user.login}`));

        log(`Followers: ${user.followers}`);

        log(`Public repos: ${user.public_repos}`);

        log(`Profile: ${user.html_url}`);

        log();
      } catch (error) {
        spinner.fail(error.message);
      }
    });
}
