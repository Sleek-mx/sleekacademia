import { calculateExamQuote, calculateWritingQuote } from "./pricing.js";

export async function seedDemoPlatform(store) {
  if (!store?.available || store.mode !== "memory") return;
  const profile = await store.upsertProfile({
    userId: "demo-client", role: "student", email: "client.demo@sleekacademia.local",
    fullName: "Demo Client", urgentPhone: "+1 312 555 0100", school: "Demo University",
  });
  await store.upsertProfile({ userId: "demo-admin", role: "admin", email: "admin.demo@sleekacademia.local", fullName: "Sleek Academia Admin" });

  const examples = [
    { id: "demo-order-available", status: "Available", service: "essay", title: "Evidence-based leadership review", subject: "Nursing leadership", pageCount: "6", deadline: "2026-08-21", pricing: calculateWritingQuote({ pages: 6 }) },
    { id: "demo-order-clarification", status: "Needs Clarification", service: "essay", title: "Policy comparison brief", subject: "Healthcare policy", pageCount: "4", deadline: "2026-08-18", pricing: calculateWritingQuote({ pages: 4 }) },
    { id: "demo-order-progress", status: "In Progress", service: "exam", title: "Clinical judgment coaching", subject: "NCLEX-RN", examHours: "2", deadline: "2026-08-12", pricing: calculateExamQuote({ hours: 2 }), paid: "deposit" },
    { id: "demo-order-delivered", status: "Delivered", service: "essay", title: "Quality improvement briefing", subject: "Healthcare quality", pageCount: "5", deadline: "2026-08-10", pricing: calculateWritingQuote({ pages: 5 }), paid: "deposit", final: "quality-briefing.txt" },
    { id: "demo-order-revision", status: "Revision Requested", service: "essay", title: "Ethics case analysis", subject: "Professional ethics", pageCount: "3", deadline: "2026-08-08", pricing: calculateWritingQuote({ pages: 3 }), paid: "full", final: "ethics-analysis.txt", firstDownloadedAt: new Date().toISOString(), revision: true },
    { id: "demo-order-completed", status: "Completed", service: "essay", title: "Completed research summary", subject: "Research methods", pageCount: "4", deadline: "2026-08-01", pricing: calculateWritingQuote({ pages: 4 }), paid: "full", final: "research-summary.txt" },
  ];

  for (const example of examples) {
    const order = await store.createOrder({
      id: example.id, userId: profile.userId, idempotencyKey: `seed:${example.id}`,
      service: example.service, subject: example.subject, title: example.title,
      description: "Deterministic localhost demonstration data with no personal information.",
      deadline: example.deadline, acceptedDeadline: example.deadline, pageCount: example.pageCount || "",
      examHours: example.examHours || "", name: profile.fullName, email: profile.email,
      status: example.status, quoteCents: example.pricing.totalCents,
      paidCents: example.paid === "full" ? example.pricing.totalCents : example.paid === "deposit" ? example.pricing.depositCents : 0,
      pricingSnapshot: example.pricing, currency: "usd", firstDownloadedAt: example.firstDownloadedAt || null,
    });
    await store.appendEvent({ requestId: order.id, actorId: "demo-admin", type: "demo.order_seeded", data: { status: order.status } });
    if (example.paid) {
      await store.createPayment({ requestId: order.id, userId: profile.userId, provider: "demo", providerTransactionId: `seed-payment:${order.id}`, milestone: example.paid === "full" ? "balance" : "deposit", amountCents: order.paidCents, currency: "usd", status: "confirmed" });
    }
    if (example.final) {
      const bytes = Buffer.from(`Demo final delivery for ${example.title}.`);
      const object = await store.putPrivateObject({ requestId: order.id, fileName: example.final, mimeType: "text/plain", bytes });
      await store.createAttachment({ requestId: order.id, userId: profile.userId, uploadedBy: "demo-admin", fileName: example.final, mimeType: "text/plain", sizeBytes: bytes.length, storagePath: object.path, category: "final", deliveryLocked: true });
    }
    if (example.revision) {
      await store.createRevision({ orderId: order.id, userId: profile.userId, requestedBy: profile.userId, instructions: "Update the conclusion while preserving the approved sources.", included: true, status: "requested" });
    }
  }
  await store.createMessage({ requestId: "demo-order-clarification", userId: profile.userId, senderId: "demo-admin", senderRole: "admin", body: "Please confirm which rubric version applies before this order is accepted." });
  await store.createNotification({ userId: profile.userId, requestId: "demo-order-delivered", type: "delivery.ready", title: "Your delivery is ready", body: "The final file is visible and unlocks after the confirmed balance payment." });
}
