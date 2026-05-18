import chalk from "chalk";
import Table from "cli-table3";

function formatHour(isoDateTime) {
  const date = new Date(isoDateTime);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDay(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function createTable(head, colWidths) {
  return new Table({
    head,
    colWidths,
    style: {
      head: [],
      border: ["gray"],
      compact: true,
    },
    wordWrap: true,
  });
}

function printCurrent(current, units) {
  const table = createTable(
    [
      chalk.cyan("Temp"),
      chalk.cyan("Feels"),
      chalk.cyan("Humidity"),
      chalk.cyan("Wind"),
      chalk.cyan("Precip"),
      chalk.cyan("Condition"),
    ],
    [11, 11, 12, 18, 10, 26],
  );

  table.push([
    `${current.temperature}${units.temperature_2m ?? "degC"}`,
    `${current.feelsLike}${units.apparent_temperature ?? "degC"}`,
    `${current.humidity}${units.relative_humidity_2m ?? "%"}`,
    `${current.windSpeed}${units.wind_speed_10m ?? "km/h"} ${current.windDirection}deg`,
    `${current.precipitation}${units.precipitation ?? "mm"}`,
    `${current.condition} (${current.weatherCode})`,
  ]);

  console.log(table.toString());
}

function printDaily(daily, units) {
  const table = createTable(
    [
      chalk.magenta("Day"),
      chalk.magenta("Min"),
      chalk.magenta("Max"),
      chalk.magenta("Rain"),
      chalk.magenta("Cond"),
      chalk.magenta("Sun"),
    ],
    [13, 9, 9, 8, 22, 16],
  );

  for (const day of daily) {
    table.push([
      formatDay(day.date),
      `${day.min}${units.temperature_2m ?? "degC"}`,
      `${day.max}${units.temperature_2m ?? "degC"}`,
      `${day.precipitationProbabilityMax}${units.precipitation_probability ?? "%"}`,
      day.condition,
      `${formatHour(day.sunrise)} ${formatHour(day.sunset)}`,
    ]);
  }

  console.log(table.toString());
}

export function renderWeather(data, options = { raw: false }) {
  const { location, current, daily, units } = data;

  console.log();
  console.log(chalk.bold.blue(`Weather ${location.label}`));
  console.log(
    chalk.gray(
      `Coords ${location.latitude}, ${location.longitude} | Timezone ${location.timezone}`,
    ),
  );
  console.log();

  printCurrent(current, units);
  console.log();

  console.log(chalk.magenta("Daily"));
  printDaily(daily, units);
  console.log();

  if (options.raw) {
    console.log(chalk.yellow("Developer Log (Raw Forecast JSON)"));
    console.log(JSON.stringify(data, null, 2));
    console.log();
  }
}

export function renderError(message) {
  console.error(chalk.red(`X ${message}`));
}
