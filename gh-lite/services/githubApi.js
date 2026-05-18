import chalk from "chalk";

import { GITHUB_API } from "../constants/api.js";
import { getToken } from "../utils/config.js";

export async function githubRequest(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      Accept: "application/vnd.github+json",
      ...options.headers,
    },
  });

  const remaining = response.headers.get("x-ratelimit-remaining");
  console.log(chalk.gray(`Rate limit remaining: ${remaining}`));

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Resource not found");
    }

    if (response.status === 403) {
      throw new Error("Rate limit exceeded");
    }

    throw new Error(`GitHub API Error: ${response.status}`);
  }

  return response.json();
}
