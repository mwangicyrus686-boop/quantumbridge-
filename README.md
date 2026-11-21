# QuantumBridge Pro Command Center

React command center built from the supplied QuantumBridge TSX component.

## Run locally

Requires Node.js 20 or newer.

For the built Windows release, extract the ZIP and run `Launch QuantumBridge.bat`. Keep its minimized server window open while using the app. It opens at `http://localhost:5173/` and serves only on this computer.

```powershell
npm install
npm run dev
```

Open `http://localhost:5173/`. The dev command starts the Vite UI and the local OAuth/API proxy together.

## Deriv OAuth setup

Create a **Web-based app (OAuth 2.0)** in the Deriv API dashboard. Add this exact local redirect URL:

```text
http://localhost:5173/
```

Enable the **Trade** scope. The app uses it to list Options accounts, request a short-lived WebSocket OTP, and connect to the selected account. Account management, application insights, and payments are optional and off by default. Enter the App ID Deriv assigns under **Settings → App ID Settings** in QuantumBridge.

The browser creates a PKCE verifier and state for every login. The local Node server exchanges the one-time code with Deriv. Access tokens remain in app memory and are not written to storage or logs. OAuth does not need a pasted API token.

For a production host, register its exact HTTPS callback URL and set `QB_OAUTH_REDIRECT_URI` on the server to that same URL. You can also set `QB_DERIV_CLIENT_ID` on the server to pin the registered App ID.

To build and serve the production bundle locally, run:

```powershell
npm run build
npm run preview
```

The app opens in simulator mode and autonomous bot execution starts paused. Live broker connections and order execution require user supplied OAuth access and an explicitly armed live execution control. Use a demo account while evaluating the interface.

## Bot research and risk gates

Starter bots now launch paused with no seeded trade history or performance claims. Each bot has its own Research Evidence Gate. Enter the minimum held-out sample, the measured cost-matched random baseline, average win/loss in R, per-trade costs, and required expectancy margin. The app shrinks the held-out win estimate toward the baseline using the configured minimum sample as the shrinkage weight. It requires positive expectancy above the baseline and margin, plus completed backtest, walk-forward, forward-test, and drawdown checks before that bot can transmit live automated orders. These evidence fields are operator-entered and are not independently verified.

Bot configurations and research evidence are saved in this browser. Session results reset when the app reloads. The paper preview never sends a broker order. Automated sizing is capped at the configured 0.5–2% risk per trade, and automation stops at the configured daily loss or peak-to-current realized drawdown limit. Do not treat the app's signal score or simulated P&L as evidence of a trading edge.

## Import bot configurations and scripts

Choose **Bot Fleet → Import Bots** to import JSON bot configurations, `.qbot` packages, or standalone `.mjs`, `.js`, and `.py` strategies. JSON can contain one bot, an array of bots, or a `bots` array. A package can include both settings and a script:

```json
{
  "format": "quantumbridge-bot",
  "version": 1,
  "bot": {
    "name": "Example strategy",
    "symbols": ["R_75"],
    "minAccuracy": 80,
    "stakeUsd": 10
  },
  "script": {
    "runtime": "node",
    "source": "export function evaluate(context) { const market = context.markets[0]; return { action: market.bias, symbol: market.symbol, rationale: 'Use the current signal' }; }"
  }
}
```

Scripts must export/default-export `evaluate(context)` in Node.js or define `evaluate(context)` in Python. The context contains the bot's bounded settings, assigned market snapshots, recent price history, and a timestamp. Return `{ "action": "BUY" | "SELL" | "HOLD", "symbol": "assigned market", "rationale": "why" }`. Imports start paused, receive new IDs, and have research evidence reset. Imports are limited to 25 bots, 256 KiB per file, and 32 KiB per script.

Script execution requires the local QuantumBridge app and Docker Desktop/Engine running; it is unavailable on GitHub Pages. On Windows, if WSL 2 is not installed, run `wsl --install --no-distribution` in an elevated PowerShell window and restart if prompted, then start Docker Desktop and wait for its Engine to be ready. The server runs each evaluation in an isolated Node.js or Python container with no network, no broker credentials, a read-only source mount, resource limits, a 15-second timeout, and bounded input/output. Docker pulls the official runtime image if it is not already present. The script can propose a signal only: QuantumBridge verifies its action and assigned symbol, then routes it through the bot's existing live-arm, research, position, sizing, and loss-limit gates. Scripts do not receive broker credentials and cannot directly place orders. Imported source is stored with that bot in the browser's local storage.

## Connect JARVIS Workshop

Run the JARVIS Trading Workshop separately from its desktop Bot Control Center:

```powershell
Set-Location "$env:USERPROFILE\Downloads\JARVIS_Bot_Control_Center\jarvis_bot_control"
python3 jarvis_workshop_v3_5.py
```

In QuantumBridge, open **Connection Options → JARVIS Link → Connect JARVIS**.
JARVIS publishes its current research/paper signals on localhost; its ordinary
Trading Bot worker is only a heartbeat demo. Signal updates never place orders
automatically. For a Deriv Options order, connect Deriv in QuantumBridge, enter
the stake, tick duration, and multiplier, request a quote, then review and
confirm the buy. Live orders additionally require the existing live execution
arm.

JARVIS can also sign in to Deriv from `http://localhost:5000/deriv/connect`.
Add this extra redirect URL to the registered OAuth app before using that page:

```text
http://localhost:5000/deriv/oauth/callback
```

Jarvis's account connection is separate from QuantumBridge's trading session;
both use the same registered App ID but each needs its own OAuth login. JARVIS
keeps its token in memory and does not place trades.

## Connect Claude to QuantumBridge and project documents

The local stdio MCP server works with Claude Desktop and Claude Code. It exposes the existing bot-fleet tools and can also let Claude list and read Markdown/plain-text documents from one folder you explicitly select. It does not upload documents or change Claude Project files; use the returned document content in the current Claude conversation or Project.

Use Node.js 20 or newer. Keep the QuantumBridge app running at `http://localhost:5173/` to use the bot-fleet tools. Choose a folder containing only documents you are comfortable sharing with Claude; the reader excludes hidden files, common generated folders, and non-document file types. It limits reads to 256 KiB per document and does not follow paths outside the selected folder. No API key or secret is required.

### Claude Desktop (Windows)

1. Open `%APPDATA%\Claude\claude_desktop_config.json` (create it if needed).
2. Add the following `mcpServers` entry, replacing `YOUR_NAME` and the folder paths with the actual locations. Double the backslashes as shown for JSON:

```json
{
  "mcpServers": {
    "quantumbridge": {
      "command": "node",
      "args": ["C:\\Users\\YOUR_NAME\\Downloads\\QuantumBridge\\mcp-server.mjs"],
      "env": {
        "QB_MCP_API_BASE": "http://localhost:5173",
        "QB_KNOWLEDGE_ROOT": "C:\\Users\\YOUR_NAME\\Documents\\QuantumBridge"
      }
    }
  }
}
```

3. Save the file and fully restart Claude Desktop. The MCP tools `list_project_documents` and `read_project_document` expose documents on demand. To use bot tools, start QuantumBridge first; `get_bot_fleet_snapshot`, `get_market_snapshot`, and `submit_paper_signal` are also available.

### Claude Code

From PowerShell, register the local server in your user configuration, replacing the paths:

```powershell
claude mcp add --transport stdio --scope user `
  --env QB_MCP_API_BASE=http://localhost:5173 `
  --env QB_KNOWLEDGE_ROOT="C:\Users\YOUR_NAME\Documents\QuantumBridge" `
  quantumbridge -- node "C:\Users\YOUR_NAME\Downloads\QuantumBridge\mcp-server.mjs"
```

Run `claude mcp list` to confirm it is configured. The folder path is a local allowlist, not a credential; do not point it at a home directory or a folder containing secrets. If QuantumBridge is not running, only the document tools work. The bot-fleet tools cannot place orders, change risk controls, or arm live execution. Paper signals are queued for human review in **Bot Fleet → MCP Agent Inbox**.

## Publish the static website with GitHub Pages

The `.github/workflows/deploy-pages.yml` workflow builds the Vite app and deploys its static files to GitHub Pages after pushes to `main` or a manual run. In the repository's **Settings → Pages**, set the build and deployment source to **GitHub Actions**. The first successful workflow run publishes the site at `https://<owner>.github.io/quantumbridge-/` (or the configured custom domain). This repository change configures deployment but does not itself make the site live; confirm the workflow and Pages URL in GitHub.

Pages hosts only the static browser app. Simulator mode and browser-saved bot settings work there; the Node API is deliberately not exposed publicly. Deriv OAuth token exchange, account APIs, the local MCP bridge, and JARVIS integration require the local Node server and are not available on the Pages site. Use the local install for those integrations. The Pages build uses the repository subpath automatically and requires no secrets.

The `.github/workflows/release-windows.yml` workflow remains available to package the full local app (including its API and MCP servers) as a Windows ZIP on version tags. To publish a release, push a tag such as `v1.0.0`:

```powershell
git tag v1.0.0
git push origin v1.0.0
```

The `.gitignore` file excludes dependencies, generated builds, release ZIPs, and local environment files from source control.
