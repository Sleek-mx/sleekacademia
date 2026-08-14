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
export const GUMROAD_STORE = "https://sleekmx.gumroad.com";

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
    sku: "OphthalmicPharmacology",
    gumroadPermalink: "OphthalmicPharmacology",
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
    sku: "DrugTherapy",
    gumroadPermalink: "DrugTherapy",
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
    sku: "OTCDrugsD441",
    gumroadPermalink: "OTCDrugsD441",
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
  Object.freeze({
    sku: "ControllingDrugsD441",
    gumroadPermalink: "ControllingDrugsD441",
    icon: "GI",
    cardTitle: "Acid-Controlling Drugs Study Guide",
    schemaName: "Acid-Controlling Drugs Study Guide — D441 (Ch. 50)",
    description:
      "High-yield question, answer, and rationale review of acid-controlling drug therapy for nursing pharmacology coursework.",
    price: "15.00",
    priceCurrency: "USD",
    image: "https://public-files.gumroad.com/yqu9wqushd69ey8vhig044w8k4kq",
  }),
  Object.freeze({
    sku: "DermatologicDrugs",
    gumroadPermalink: "DermatologicDrugs",
    icon: "Rx",
    cardTitle: "Dermatologic Drugs Q&A",
    schemaName: "Dermatologic Drugs — Nursing Pharmacology Q&A with Rationale",
    description:
      "Question, answer, and rationale review of dermatologic drug therapy for nursing pharmacology exam prep.",
    price: "15.00",
    priceCurrency: "USD",
    image: "https://public-files.gumroad.com/czjkihqtntsmtqsjoux01frgf7w1",
  }),
  Object.freeze({
    sku: "NURSG5315Exam2",
    gumroadPermalink: "NURSG5315Exam2",
    icon: "Ex2",
    cardTitle: "NURSG 5315 Exam 2 Mastery Workbook",
    schemaName: "NURSG5315 Exam2 Mastery Workbook — Advanced Pathophysiology",
    description:
      "Structured Exam 2 review workbook with high-yield notes, application-style questions, and rationale-backed answers.",
    price: "15.00",
    priceCurrency: "USD",
    image: "https://public-files.gumroad.com/r7608jhiotjcyjsweuwcuazvfwuo",
  }),
  Object.freeze({
    sku: "Exam5",
    gumroadPermalink: "Exam5",
    icon: "Ex5",
    cardTitle: "The Night Before Exam 5 Study Pack",
    schemaName:
      "The Night Before Exam 5: Endocrine, GI, and Obesity Done in One Pack — Advanced Pathophysiology",
    description:
      "Five-module last-mile review covering endocrine, GI, and obesity content, with practice questions and answer rationales.",
    price: "12.00",
    priceCurrency: "USD",
    image: "https://public-files.gumroad.com/u4ocseu6zxpiscw85fi6bfr6d2xj",
  }),
  Object.freeze({
    sku: "NURSG5315_Exam2",
    gumroadPermalink: "NURSG5315_Exam2",
    icon: "Ex2",
    cardTitle: "NURSG 5315 Exam 2 Study Pack",
    schemaName: "NURSG 5315 Exam 2 — Advanced Pathophysiology Review",
    description:
      "Exam 2 review covering tumor markers, immunology, and musculoskeletal pathophysiology, with rationale-backed practice questions.",
    price: "12.00",
    priceCurrency: "USD",
    image: "https://public-files.gumroad.com/p400unamm1ur0poy0h489u2u99z2",
  }),
  Object.freeze({
    sku: "Exam5_5315",
    gumroadPermalink: "Exam5_5315",
    icon: "Ex5",
    cardTitle: "Advanced Pathophysiology Exam 5 Study Pack",
    schemaName:
      "Advanced Pathophysiology Exam 5 Study Pack: Obesity, Endocrine, GI, Neuro & Renal Review",
    description:
      "Cross-system Exam 5 review connecting obesity, endocrine, GI, neuro, and renal pathophysiology with integrated practice questions.",
    price: "10.00",
    priceCurrency: "USD",
    image: "https://public-files.gumroad.com/kmidy9rwcsddnvz6nh01k4du8l38",
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
