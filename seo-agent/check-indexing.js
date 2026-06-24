#!/usr/bin/env node
/** Quick index-coverage check for key URLs via the URL Inspection API. */
import { google } from "googleapis";

const CRED_PATH = process.env.SC_CREDENTIALS || "./service-account.json";
const SITE_URL = process.env.SC_SITE_URL || "sc-domain:sleekacademia.com";
const BASE = "https://sleekacademia.com";

const URLS = [
  "/", "/nclex-prep.html", "/ube-bar-exam-prep.html", "/cfa-level-1-prep.html",
  "/comptia-security-plus-prep.html", "/courses.html", "/blog.html",
  "/blog/nclex-study-schedule.html", "/blog/ube-decoded.html",
  "/blog/cfa-level-1-study-plan.html",
];

const auth = new google.auth.GoogleAuth({
  keyFile: CRED_PATH,
  scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
});
const sc = google.searchconsole({ version: "v1", auth: await auth.getClient() });

for (const path of URLS) {
  try {
    const res = await sc.urlInspection.index.inspect({
      requestBody: { inspectionUrl: BASE + path, siteUrl: SITE_URL },
    });
    const r = res.data.inspectionResult?.indexStatusResult || {};
    console.log(`${(r.verdict || "?").padEnd(8)} | ${(r.coverageState || "unknown").padEnd(40)} | ${path}`);
  } catch (e) {
    console.log(`ERROR    | ${e.message.slice(0, 40).padEnd(40)} | ${path}`);
  }
}
