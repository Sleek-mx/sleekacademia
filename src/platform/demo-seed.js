export async function seedDemoPlatform(store) {
  if (!store?.available || store.mode !== "memory") return;
  const profile = await store.upsertProfile({
    userId: "demo-client",
    role: "student",
    email: "max.demo@sleekacademia.local",
    fullName: "Max Demo",
    urgentPhone: "+1 312 555 0174",
    school: "Demo University",
  });
  await store.upsertProfile({
    userId: "demo-admin",
    role: "admin",
    email: "admin.demo@sleekacademia.local",
    fullName: "Sleek Academia Admin",
  });

  const depositDue = await store.createRequest({
    id: "demo-request-deposit",
    userId: profile.userId,
    idempotencyKey: "demo-seed-deposit",
    service: "essay",
    subject: "Nursing leadership",
    title: "Evidence-based leadership review",
    description: "A six-page APA review using the supplied rubric and course sources.",
    deadline: "2026-07-21",
    citationStyle: "APA 7",
    pageCount: "6",
    name: profile.fullName,
    email: profile.email,
    status: "Deposit Due",
    quoteCents: 24000,
    paidCents: 0,
  });
  await store.appendEvent({ requestId: depositDue.id, actorId: "demo-admin", type: "request.quoted", data: { quoteCents: 24000 } });
  await store.createMessage({ requestId: depositDue.id, userId: profile.userId, senderId: "demo-admin", senderRole: "admin", body: "Your brief is clear. The quote is ready and the deposit unlocks the work stage." });

  const inProgress = await store.createRequest({
    id: "demo-request-progress",
    userId: profile.userId,
    idempotencyKey: "demo-seed-progress",
    service: "exam",
    subject: "NCLEX-RN",
    title: "Four-week clinical judgment plan",
    description: "Build a focused study plan around weak client-needs areas.",
    deadline: "2026-08-12",
    name: profile.fullName,
    email: profile.email,
    status: "In Progress",
    quoteCents: 18000,
    paidCents: 9000,
  });
  await store.createPayment({ requestId: inProgress.id, userId: profile.userId, provider: "demo", providerTransactionId: "demo-payment-deposit", milestone: "deposit", amountCents: 9000, status: "confirmed" });
  await store.appendEvent({ requestId: inProgress.id, actorId: "demo-admin", type: "request.in_progress", data: { status: "In Progress" } });

  const completed = await store.createRequest({
    id: "demo-request-complete",
    userId: profile.userId,
    idempotencyKey: "demo-seed-complete",
    service: "essay",
    subject: "Healthcare quality",
    title: "Quality improvement briefing",
    description: "Completed demo showing protected final delivery and AI-use report.",
    deadline: "2026-07-10",
    citationStyle: "APA 7",
    pageCount: "4",
    name: profile.fullName,
    email: profile.email,
    status: "Completed",
    quoteCents: 16000,
    paidCents: 16000,
  });
  await store.createPayment({ requestId: completed.id, userId: profile.userId, provider: "demo", providerTransactionId: "demo-payment-complete", milestone: "balance", amountCents: 16000, status: "confirmed" });
  for (const file of [
    { fileName: "completed-work.txt", category: "final", body: "Demo completed work for local review." },
    { fileName: "ai-use-report.txt", category: "ai-report", body: "Demo AI-use transparency report for local review." },
  ]) {
    const object = await store.putPrivateObject({ requestId: completed.id, fileName: file.fileName, mimeType: "text/plain", bytes: Buffer.from(file.body) });
    await store.createAttachment({ requestId: completed.id, userId: profile.userId, uploadedBy: "demo-admin", fileName: file.fileName, mimeType: "text/plain", sizeBytes: Buffer.byteLength(file.body), storagePath: object.path, category: file.category, deliveryLocked: true });
  }
  await store.createNotification({ userId: profile.userId, requestId: completed.id, type: "delivery.ready", title: "Your completed files are ready", body: "Final work and the AI-use report are unlocked." });
}
