// Manual MoneyGram-to-mobile-money paywall.
//
// PayPal is restricted on the account this quiz used, and Stripe/Paystack need
// live keys or account approvals that are not in place yet. Until one of those
// is ready, the $10 unlock runs on a manual claim: the learner sends money via
// MoneyGram to this M-Pesa number, submits the MoneyGram reference number, and
// the operator verifies the payout landed before emailing an access code.
//
// There is no automated verification here — MoneyGram has no public API for it.
// See src/quiz/router.js "/unlock/manual-claim" for the claim endpoint, and
// docs/moneygram-payment-instructions.md for the buyer-facing instructions.

/**
 * IMPORTANT: `recipientName` must be replaced with the exact legal name
 * registered on this M-Pesa line before this goes live. MoneyGram mobile-wallet
 * payouts are matched by recipient name; a mismatch delays or fails the payout.
 */
export const MONEYGRAM_RECIPIENT = Object.freeze({
  phone: "0724543489",
  countryCode: "+254",
  recipientName: "REPLACE_WITH_EXACT_MPESA_REGISTERED_NAME",
  country: "Kenya",
  receiveMethod: "Mobile Wallet — M-Pesa",
});

const REFERENCE_PATTERN = /^[A-Za-z0-9]{6,12}$/;

/** MoneyGram reference numbers are commonly 8 digits, but validate loosely. */
export function isPlausibleReference(value) {
  return typeof value === "string" && REFERENCE_PATTERN.test(value.trim());
}
