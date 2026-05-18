import ora from "ora";

import chalk from "chalk";

import { githubRequest } from "../services/githubApi.js";

import { createTable } from "../utils/table.js";

export default function (program) {
  program
    .command("search")
    .argument("<query>")
    .option("-p, --page <number>", "Page number", "1")
    .description("Search repositories")
    .action(async (query, options) => {
      const page = options.page;

      const spinner = ora("Searching repositories...").start();

      try {
        const data = await githubRequest(
          `/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=10`,
        );

        spinner.stop();

        const table = createTable(["Repository", "Language", "Stars"]);

        data.items.slice(0, 10).forEach((repo) => {
          table.push([
            chalk.blue(repo.full_name),
            repo.language || "-",
            repo.stargazers_count,
          ]);
        });

        console.log(table.toString());
      } catch (error) {
        spinner.fail(error.message);
      }
    });
}
