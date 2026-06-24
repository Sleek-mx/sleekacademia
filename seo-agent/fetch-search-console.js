#!/usr/bin/env node
/**
 * Pulls Google Search Console performance data for sleekacademia.com and prints
 * a JSON snapshot the weekly SEO agent reasons over.
 *
 * "Clicks" = organic visitors from Google search. The site goal is >= 10/day.
 *
 * Config (env vars, all optional except credentials):
 *   SC_CREDENTIALS  Path to the service-account JSON key. Default: ./service-account.json
 *   SC_SITE_URL     Search Console property. Default: sc-domain:sleekacademia.com
 *                   Use "https://sleekacademia.com/" if it's a URL-prefix property.
 *   SC_GOAL_PER_DAY Daily organic-clicks target. Default: 10
 *
 * Usage:  node fetch-search-console.js  > report-data.json
 */

import { google } from "googleapis";
import fs from "node:fs";

const CRED_PATH = process.env.SC_CREDENTIALS || "./service-account.json";
const SITE_URL = process.env.SC_SITE_URL || "sc-domain:sleekacademia.com";
const GOAL_PER_DAY = Number(process.env.SC_GOAL_PER_DAY || 10);

// Quick-win tuning knobs.
const QUICKWIN_MIN_POS = 8; // page-2-ish: real upside if nudged up
const QUICKWIN_MAX_POS = 20;
const QUICKWIN_MIN_IMPRESSIONS = 20; // ignore noise with no demand
const LOWCTR_MAX_POS = 10; // ranking well but under-clicked => title/meta problem
const LOWCTR_MAX_CTR = 0.02; // < 2% CTR while on page 1 is suspicious

function isoDaysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

function ensureCredentials() {
  if (!fs.existsSync(CRED_PATH)) {
    console.error(
      `\nMissing service-account key at "${CRED_PATH}".\n` +
        `Set SC_CREDENTIALS to its path, or place the JSON there.\n` +
        `See seo-agent/README.md for the one-time Google setup.\n`,
    );
    process.exit(1);
  }
}

async function getClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CRED_PATH,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
  return google.searchconsole({ version: "v1", auth: await auth.getClient() });
}

async function query(sc, { startDate, endDate, dimensions = [], rowLimit = 25 }) {
  const res = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate, endDate, dimensions, rowLimit, dataState: "all" },
  });
  return res.data.rows || [];
}

function totals(rows) {
  const t = rows.reduce(
    (a, r) => {
      a.clicks += r.clicks || 0;
      a.impressions += r.impressions || 0;
      a.posWeight += (r.position || 0) * (r.impressions || 0);
      return a;
    },
    { clicks: 0, impressions: 0, posWeight: 0 },
  );
  return {
    clicks: t.clicks,
    impressions: t.impressions,
    ctr: t.impressions ? +(t.clicks / t.impressions).toFixed(4) : 0,
    avgPosition: t.impressions ? +(t.posWeight / t.impressions).toFixed(1) : null,
  };
}

async function summarizeWindow(sc, days) {
  const startDate = isoDaysAgo(days);
  const endDate = isoDaysAgo(1); // SC data lags ~1-2 days
  const rows = await query(sc, { startDate, endDate, dimensions: ["date"], rowLimit: 1000 });
  const t = totals(rows);
  return {
    windowDays: days,
    startDate,
    endDate,
    ...t,
    clicksPerDay: +(t.clicks / days).toFixed(2),
    goalPerDay: GOAL_PER_DAY,
    pctOfGoal: +(((t.clicks / days) / GOAL_PER_DAY) * 100).toFixed(0),
  };
}

async function main() {
  ensureCredentials();
  const sc = await getClient();
  const start28 = isoDaysAgo(28);
  const end = isoDaysAgo(1);

  const [week, month, queries, pages] = await Promise.all([
    summarizeWindow(sc, 7),
    summarizeWindow(sc, 28),
    query(sc, { startDate: start28, endDate: end, dimensions: ["query"], rowLimit: 200 }),
    query(sc, { startDate: start28, endDate: end, dimensions: ["page"], rowLimit: 200 }),
  ]);

  const round = (r) => ({
    ...r,
    ctr: +((r.ctr || 0) * 100).toFixed(1),
    position: +(r.position || 0).toFixed(1),
  });

  const quickWinQueries = queries
    .filter(
      (r) =>
        r.position >= QUICKWIN_MIN_POS &&
        r.position <= QUICKWIN_MAX_POS &&
        r.impressions >= QUICKWIN_MIN_IMPRESSIONS,
    )
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15)
    .map((r) => ({ query: r.keys[0], ...round(r) }));

  const lowCtrPages = pages
    .filter((r) => r.position <= LOWCTR_MAX_POS && r.ctr <= LOWCTR_MAX_CTR && r.impressions >= QUICKWIN_MIN_IMPRESSIONS)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10)
    .map((r) => ({ page: r.keys[0], ...round(r) }));

  const report = {
    generatedAt: new Date().toISOString(),
    site: SITE_URL,
    goalPerDay: GOAL_PER_DAY,
    summary: { last7Days: week, last28Days: month },
    onTrack: week.clicksPerDay >= GOAL_PER_DAY,
    topQueries: queries
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 20)
      .map((r) => ({ query: r.keys[0], ...round(r) })),
    topPages: pages
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 20)
      .map((r) => ({ page: r.keys[0], ...round(r) })),
    quickWinQueries, // positions 8-20 with real demand: nudge to page 1
    lowCtrPages, // ranking well but under-clicked: rewrite title/meta
  };

  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error("Search Console fetch failed:", err.message);
  if (err.message?.includes("403")) {
    console.error("-> Is the service-account email added as a user on the SC property?");
  }
  process.exit(1);
});
