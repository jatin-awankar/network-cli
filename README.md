# network-cli

Monorepo with two Node.js terminal tools:

- `gh-lite`: Lightweight GitHub CLI for user, repo, issue, PR, and search lookups
- `weather-cli`: Compact weather CLI with current + daily forecast output

## Prerequisites

- Node.js 18+
- npm

## Projects

### 1) gh-lite

Mini GitHub CLI powered by GitHub REST API.

#### Setup

```bash
cd gh-lite
npm install
npm link
```

#### Commands

```bash
gh-lite auth
gh-lite user <username>
gh-lite repos <username>
gh-lite repo <owner/repo>
gh-lite issues <owner/repo>
gh-lite pulls <owner/repo>
gh-lite search <query> --page 1
```

#### Notes

- `auth` stores your token locally at `~/.gh-lite/config.json`
- Use a GitHub personal access token for higher rate limits/private access

#### Example

```bash
gh-lite auth
gh-lite repo vercel/next.js
gh-lite issues nodejs/node
gh-lite search "cli tool" --page 2
```

---

### 2) weather-cli

Simple weather CLI using Open-Meteo.

#### Setup

```bash
cd weather-cli
npm install
npm link
```

#### Usage

```bash
weather get <city>
```

#### Options

- `-d, --days <count>`: Daily forecast days (`1-10`, default `7`)
- `--raw`: Print full JSON payload for debugging

#### Example

```bash
weather get "Pune" --days 5
weather get "New York" --raw
```

## Development

Run each CLI directly without linking:

```bash
node gh-lite/index.js --help
node weather-cli/index.js --help
```
