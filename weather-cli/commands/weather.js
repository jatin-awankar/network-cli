import ora from "ora";

import { getWeather } from "../services/weatherServices.js";

import { renderWeather, renderError } from "../utils/ui.js";

export default function (program) {
  program
    .command("get")
    .argument("<city>")
    .description("Get full weather forecast for a city")
    .option("-d, --days <count>", "Daily forecast points to print (1-10)", "7")
    .option("--raw", "Print full developer JSON payload")
    .action(async (city, options) => {
      const days = Number.parseInt(options.days, 10);

      if (Number.isNaN(days) || days < 1 || days > 10) {
        renderError("`--days` must be a number between 1 and 10");
        return;
      }

      const spinner = ora("Fetching weather...").start();

      try {
        const data = await getWeather(city, { days });

        spinner.succeed("Forecast loaded");

        renderWeather(data, { raw: Boolean(options.raw) });
      } catch (error) {
        spinner.fail("Request failed");

        renderError(error.message);
      }
    });
}
