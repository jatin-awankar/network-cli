import fs from "fs";

import os from "os";

import path from "path";

const CONFIG_DIR = path.join(os.homedir(), ".gh-lite");

const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");

export function saveToken(token) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR);
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ token }, null, 2));
}

export function getToken() {
  if (!fs.existsSync(CONFIG_PATH)) {
    return null;
  }

  const data = JSON.parse(fs.readFileSync(CONFIG_PATH));

  return data.token;
}
