export function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

export function text(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function getStore(req, fallbackStore) {
  return req.platformStore || fallbackStore;
}

export async function orderAccess(store, orderId, identity) {
  const order = await store.getOrderForUser(orderId, identity.userId, { role: identity.role });
  return order ? { order } : { status: 404, error: "Order not found." };
}

export function publicAttachment(attachment) {
  if (!attachment) return attachment;
  const { storagePath: _storagePath, ...safe } = attachment;
  return safe;
}

export async function orderDetails(store, order, identity) {
  const [events, messages, attachments, payments, revisions, readState] = await Promise.all([
    store.listEvents(order.id), store.listMessages(order.id), store.listAttachments(order.id),
    store.listPayments(order.id), store.listRevisions(order.id), store.getReadState(order.id, identity.userId),
  ]);
  return { order, events, messages, attachments: attachments.map(publicAttachment), payments, revisions, readState };
}
