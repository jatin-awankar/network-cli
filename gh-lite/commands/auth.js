import inquirer from "inquirer";

import chalk from "chalk";

import { saveToken } from "../utils/config.js";

export default function (program) {
  program
    .command("auth")
    .description("Authenticate")
    .action(async () => {
      const answers = await inquirer.prompt([
        {
          type: "password",
          name: "token",
          message: "Enter GitHub token:",
        },
      ]);

      saveToken(answers.token);

      console.log(chalk.green("✔ Token saved"));
    });
}
