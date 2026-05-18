import ora from "ora";

import chalk from "chalk";

import { githubRequest } from "../services/githubApi.js";

export default function (program) {
  program
    .command("repo")
    .argument("<repository>")
    .description("Get repository details")
    .action(async (repository) => {
      const spinner = ora("Fetching repository...").start();

      try {
        const repo = await githubRequest(`/repos/${repository}`);

        spinner.stop();

        console.log();

        console.log(chalk.blue(`📦 ${repo.full_name}`));

        console.log(`Description: ${repo.description || "-"}`);

        console.log(`⭐ Stars: ${repo.stargazers_count}`);

        console.log(`🍴 Forks: ${repo.forks_count}`);

        console.log(`🐛 Open Issues: ${repo.open_issues_count}`);

        console.log(`🔗 ${repo.html_url}`);

        console.log();
      } catch (error) {
        spinner.fail(error.message);
      }
    });
}
