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

## Connect MCP agents to the bot fleet

QuantumBridge includes a local stdio MCP server for MCP-compatible AI clients. Start QuantumBridge first so its local API is available at `http://localhost:5173/`, then add a server entry to the MCP client's configuration. Replace the example path with the full path to the extracted `mcp-server.mjs` file:

```json
{
  "mcpServers": {
    "quantumbridge-bots": {
      "command": "node",
      "args": ["C:/Users/your-name/Downloads/QuantumBridge/mcp-server.mjs"],
      "env": {
        "QB_MCP_API_BASE": "http://localhost:5173"
      }
    }
  }
}
```

The server provides `get_bot_fleet_snapshot`, `get_market_snapshot`, and `submit_paper_signal`. Signal proposals must use an existing bot and one of its assigned markets. They appear in **Bot Fleet → MCP Agent Inbox** for a person to record as paper or dismiss. MCP has no order placement tool; it cannot buy, sell, change risk controls, or arm live execution. The bridge is restricted to local computer connections and does not expose OAuth tokens or account identifiers.

This connection uses MCP's local stdio transport. See the [MCP stdio transport documentation](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/serving/stdio.md) for client configuration details.

## Publish with GitHub

The `.github/workflows/release-windows.yml` workflow builds the app and attaches a Windows ZIP to a GitHub Release whenever a `v*` version tag is pushed. The ZIP includes the built interface, local API server, MCP server, and Windows launcher. It does not publish an internet-facing app server.

To trigger the first release after adding this project to a GitHub repository, push the source to its default branch, then create and push a version tag such as `v1.0.0`:

```powershell
git tag v1.0.0
git push origin v1.0.0
```

GitHub Pages is not configured for this project. Pages serves static files and does not run the Node API needed for OAuth code exchange, JARVIS, and the local MCP bridge. To offer the full app as a public website, deploy the Node server to a separate Node-capable host and configure its OAuth callback and environment settings. See [GitHub Pages' supported site types](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

The `.gitignore` file excludes dependencies, generated builds, release ZIPs, and local environment files from source control.
