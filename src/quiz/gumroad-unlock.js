// Automated quiz unlock from a verified Gumroad sale.
//
// Reuses the entitlement/email machinery that was already built for the
// deleted PayPal capture flow (issueEntitlement in signing.js, accessLink /
// emailBuyerAccessLink / notifyUnlock in notify.js) and that quiz-engine.js's
// #unlock= fragment handling was already written to redeem — none of that
// needed to change, only something to call it again.

import { accessLink, emailBuyerAccessLink, notifyUnlock } from "./notify.js";
import { QUIZZES } from "./quizzes.js";
import { issueEntitlement } from "./signing.js";

const ENTITLEMENT_TTL_DAYS = 365;

export async function unlockQuizFromGumroadSale({ quizId, buyerEmail, saleId, priceCents }) {
  const quiz = QUIZZES[quizId];
  if (!quiz) return { ok: false, reason: "unknown-quiz" };

  const entitlement = issueEntitlement({ sub: "gumroad", source: "gumroad", orderId: saleId }, ENTITLEMENT_TTL_DAYS, quiz.scope);
  const link = accessLink(quiz, entitlement);
  const result = {
    provider: "gumroad",
    orderId: saleId,
    amount: (Number(priceCents) / 100).toFixed(2),
    payer: buyerEmail || "",
  };

  const buyerEmailOutcome = await emailBuyerAccessLink(quiz, result, entitlement);
  await notifyUnlock(quiz, result, { buyerEmailOutcome, link });
  return { ok: true, entitlement, link };
}
