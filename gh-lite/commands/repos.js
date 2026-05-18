import ora from "ora";

import Table from "cli-table3";

import { githubRequest } from "../services/githubApi.js";

export default function (program) {
  program
    .command("repos")
    .argument("<username>")
    .description("List repositories")
    .action(async (username) => {
      const spinner = ora("Fetching repos...").start();

      try {
        const repos = await githubRequest(`/users/${username}/repos`);

        spinner.stop();

        const table = new Table({
          head: ["Repository", "Language", "Stars"],
        });

        repos.forEach((repo) => {
          table.push([repo.name, repo.language || "-", repo.stargazers_count]);
        });

        console.log(table.toString());
      } catch (error) {
        spinner.fail(error.message);
      }
    });
}
