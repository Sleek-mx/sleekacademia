# seo-agent

Tooling for the weekly SEO agent on sleekacademia.com. Goal: **>= 10 organic visitors/day** (Search Console clicks).

- `fetch-search-console.js` — pulls Search Console performance data → JSON the agent reasons over.
- `WEEKLY-AGENT.md` — the loop the scheduled agent runs each week (measure → diagnose → act → report).
- `reports/` — weekly progress reports (git-ignored locally; committed via the weekly PR).

## One-time setup

1. **Service account** (see chat walkthrough): create one in Google Cloud, enable the
   *Google Search Console API*, download its JSON key, and add the service-account
   **email** as a user on the `sleekacademia.com` Search Console property.
2. Put the key at `seo-agent/service-account.json` (git-ignored), or set `SC_CREDENTIALS`
   to its path.
3. Install deps:
   ```bash
   cd seo-agent && npm install
   ```

## Run the fetcher

```bash
# Domain property (default):
node fetch-search-console.js > report-data.json

# URL-prefix property instead:
SC_SITE_URL="https://sleekacademia.com/" node fetch-search-console.js > report-data.json
```

Output includes: clicks/day vs the 10/day goal (7d + 28d), top queries/pages,
`quickWinQueries` (positions 8-20 to nudge to page 1), and `lowCtrPages`
(ranking but under-clicked → rewrite title/meta).

## Config (env)

| Var | Default | Meaning |
|-----|---------|---------|
| `SC_CREDENTIALS` | `./service-account.json` | Path to service-account key |
| `SC_SITE_URL` | `sc-domain:sleekacademia.com` | SC property (use `https://...` for URL-prefix) |
| `SC_GOAL_PER_DAY` | `10` | Daily organic-clicks target |

## Security

The service-account key is a credential. It's git-ignored. Never commit it or paste it
into chat. For the scheduled cloud agent, provide it as a stored secret, not in the repo.
