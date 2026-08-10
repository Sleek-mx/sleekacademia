// Single source of truth for everything the store page says about a product.
//
// Both the visible product cards and the Product JSON-LD on public/store.html are generated
// from this file by scripts/build-store-schema.mjs. Editing store.html by hand will be undone
// by the next build, and test/store-schema.test.js fails if the two ever drift apart.
//
// To add a product: append an entry here, run `npm run build:store`, commit both files.
// To refresh prices and cover images from Gumroad: `npm run build:store -- --from-gumroad`
// (requires GUMROAD_ACCESS_TOKEN).
//
// `price` is a decimal string because that is what Google expects in the offer, and floats
// round badly. `rating` is deliberately absent on every product: the store has no review
// system, and inventing ratings is a manual-action risk. See RATING_POLICY below.

export const STORE_ORIGIN = "https://sleekacademia.com";
export const STORE_PATH = "/store.html";
export const GUMROAD_STORE = "https://macsin6.gumroad.com";

/** Offers stay valid until this date; bump it when prices are reviewed. */
export const PRICE_VALID_UNTIL = "2027-12-31";

/** Digital downloads are not shipped, so no shippingDetails node is emitted. */
export const RETURN_POLICY = Object.freeze({
  countries: ["US", "GB", "CA", "AU"],
  days: 30,
  freeReturns: true,
});

/**
 * A product may carry an optional `rating: { ratingValue, reviewCount, reviews: [...] }`.
 * When present it is emitted as aggregateRating/review. It must come from real collected
 * reviews — see the note in README-STORE-SCHEMA.md. Never populate it by hand to satisfy
 * a Search Console warning.
 */
export const RATING_POLICY = "real-reviews-only";

export const STORE_PRODUCTS = Object.freeze([
  Object.freeze({
    sku: "eiwdcu",
    gumroadPermalink: "eiwdcu",
    icon: "Rx",
    cardTitle: "Ophthalmic Pharmacology Q&A",
    schemaName:
      "Ophthalmic Pharmacology 56-Question Q&A with Rationale — Nursing Pharmacology",
    description:
      "Fifty-six focused questions with rationales for reviewing ophthalmic medications and nursing implications.",
    price: "15.00",
    priceCurrency: "USD",
    image: "https://public-files.gumroad.com/c3nr4lbeon6hm4oywq8xq2eqmp4c",
  }),
  Object.freeze({
    sku: "jmczyx",
    gumroadPermalink: "jmczyx",
    icon: "ED",
    cardTitle: "Patient Education and Drug Therapy Q&A",
    schemaName:
      "Patient Education & Drug Therapy Q&A with Rationale — Nursing Pharmacology (Ch. 6)",
    description:
      "Practice questions and rationales centered on safe teaching, medication use, and patient understanding.",
    price: "15.00",
    priceCurrency: "USD",
    image: "https://public-files.gumroad.com/abzo3nzcmdzialhwf60rhblais1h",
  }),
  Object.freeze({
    sku: "eyfmy",
    gumroadPermalink: "eyfmy",
    icon: "OTC",
    cardTitle: "OTC Drugs and Herbal Supplements Q&A",
    schemaName:
      "OTC Drugs & Herbal Supplements D441 — Nursing Pharmacology (Ch. 7)",
    description:
      "A focused review of nonprescription drugs, supplements, interactions, and patient safety.",
    price: "15.00",
    priceCurrency: "USD",
    image: "https://public-files.gumroad.com/inyomfm593vgq4vp2v6a3s6uihzi",
  }),
]);

export function productUrl(product) {
  return `${GUMROAD_STORE}/l/${product.gumroadPermalink}`;
}

/** "15.00" USD -> "$15". Used for the visible card copy so it matches the offer. */
export function formatPrice(product) {
  const amount = Number(product.price);
  const body = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  const symbol = { USD: "$", GBP: "£", EUR: "€" }[product.priceCurrency];
  return symbol ? `${symbol}${body}` : `${body} ${product.priceCurrency}`;
}
