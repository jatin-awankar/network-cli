#!/usr/bin/env node

import { Command } from "commander";

import registerWeatherCommand from "./commands/weather.js";

const program = new Command();

program.name("weather").description("Weather CLI").version("1.0.0");

registerWeatherCommand(program);

program.parse();
