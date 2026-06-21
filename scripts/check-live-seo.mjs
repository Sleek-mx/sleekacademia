import { pathToFileURL } from "node:url";

export function validateSeoSnapshot(snapshot) {
  const failures = [];

  if (snapshot.health.status !== 200) failures.push(`health endpoint returned ${snapshot.health.status}`);
  try {
    if (JSON.parse(snapshot.health.body).ok !== true) failures.push("health endpoint did not report ok=true");
  } catch {
    failures.push("health endpoint did not report ok=true");
  }

  if (snapshot.robots.status !== 200) failures.push(`robots.txt returned ${snapshot.robots.status}`);
  if (!/Sitemap:\s*https:\/\/sleekacademia\.com\/sitemap\.xml/i.test(snapshot.robots.body)) {
    failures.push("robots.txt does not advertise the canonical sitemap");
  }

  if (snapshot.sitemap.status !== 200) failures.push(`sitemap.xml returned ${snapshot.sitemap.status}`);
  if (!/<loc>https:\/\/sleekacademia\.com\/<\/loc>/.test(snapshot.sitemap.body)) {
    failures.push("sitemap.xml does not contain the homepage");
  }

  if (snapshot.homepage.status !== 200) failures.push(`homepage returned ${snapshot.homepage.status}`);
  if (!/<title>[^<]*academic tutoring[^<]*<\/title>/i.test(snapshot.homepage.body)) {
    failures.push("homepage title does not describe academic tutoring");
  }
  if (!/<link\s+rel=["']canonical["']\s+href=["']https:\/\/sleekacademia\.com\/["'][^>]*>/i.test(snapshot.homepage.body)) {
    failures.push("homepage canonical is missing or incorrect");
  }

  return failures;
}

export async function collectSeoSnapshot(siteUrl, fetchImpl = fetch) {
  const base = siteUrl.replace(/\/$/, "");
  const [health, robots, sitemap, homepage] = await Promise.all([
    fetchText(`${base}/api/health`, fetchImpl),
    fetchText(`${base}/robots.txt`, fetchImpl),
    fetchText(`${base}/sitemap.xml`, fetchImpl),
    fetchText(`${base}/`, fetchImpl)
  ]);

  return { health, robots, sitemap, homepage };
}

async function fetchText(url, fetchImpl) {
  const response = await fetchImpl(url, {
    headers: { "user-agent": "SleekAcademia-SEO-Watchdog/1.0" },
    signal: AbortSignal.timeout(15000)
  });
  return { status: response.status, body: await response.text() };
}

async function main() {
  const siteUrl = process.env.SITE_URL || "https://sleekacademia.com";
  const failures = validateSeoSnapshot(await collectSeoSnapshot(siteUrl));

  if (failures.length > 0) {
    console.error(`SEO watchdog failed for ${siteUrl}:`);
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
    return;
  }

  console.log(`SEO watchdog passed for ${siteUrl}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
