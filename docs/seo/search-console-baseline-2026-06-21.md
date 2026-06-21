# Search Console Baseline — 2026-06-21

Source: `sleekacademia.com-Performance-on-Search-2026-06-21.zip`, exported by the site owner from Google Search Console for the last three months.

## Baseline

| Period | Clicks | Impressions | CTR |
|---|---:|---:|---:|
| 2026-04-22 to 2026-04-30 | 0 | 7 | 0% |
| 2026-05-01 to 2026-05-31 | 1 | 22 | 4.55% |
| 2026-06-01 to 2026-06-19 | 0 | 15 | 0% |
| **Total** | **1** | **44** | **2.27%** |

Google currently has almost no evidence connecting Sleek Academia with tutoring-intent searches. The visible queries are branded or ambiguous: `sleek academy`, `sleek writers`, `academia`, `sleekwriters`, and `sleek lab`.

## Technical signals found in the export

- `/index.html` appeared separately from `/`, creating a duplicate homepage signal.
- Obsolete `/services.html` and `/order.html` URLs still earned impressions and clicks.
- Both `www.sleekacademia.com` and `sleekacademia.com` URLs appeared in page data.
- An onboarding URL containing query parameters appeared as a search result.
- The only recorded click by device was mobile.

## Actions in PR #1

- Permanently redirect `/index.html` to `/`.
- Permanently redirect `/services.html` to `/courses.html`.
- Permanently redirect `/order.html` to `/onboard.html`.
- Add self-referencing canonical URLs to indexable pages.
- Remove onboarding, login, signup, dashboard, payment, and other utility pages from the sitemap and mark them `noindex,follow`.
- Clarify the homepage entity and service positioning around academic tutoring.
- Publish a verified Sir Maxwell founder and tutor profile.

## Content priorities after indexing stabilizes

1. Nursing tutoring and NCLEX support, using existing course-level experience as the first authority cluster.
2. UBE tutoring and bar-exam study support.
3. CompTIA A+ and Security+ tutoring.
4. CFA Level I tutoring.
5. Accounting tutoring only after specific accounting subjects and experience are documented.

The page-level click rows should not be summed as the site-wide click baseline because Search Console dimensions can be aggregated differently. The chart export is the baseline source of truth.
