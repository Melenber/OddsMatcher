# Odds Matcher

Personal matched betting odds comparison tool. Shows best back odds from major UK bookmakers vs Betfair lay odds, with rating % and qualifying loss estimates.

## Stack
- React + Vite
- The Odds API (bookmaker odds)
- Betfair API via Node proxy on Render.com (lay odds — Phase 2)
- Deployed to GitHub Pages

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Add your API key
cp .env.example .env
# Edit .env and paste your key from https://the-odds-api.com

# 3. Run locally
npm run dev
```

## Deploy to GitHub Pages

```bash
# Build and push to gh-pages branch
npm run deploy
```

Make sure `vite.config.js` has `base` set to your repo name:
```js
base: '/your-repo-name/'
```

Then enable GitHub Pages in your repo settings → Pages → Source: `gh-pages` branch.

## Markets supported
- Match winner (1X2)
- Both Teams to Score (BTTS)
- Over/Under Goals

## Betfair proxy (Phase 2)
See `/proxy` folder (to be added) for the Node.js server that handles Betfair authentication and returns lay odds.
