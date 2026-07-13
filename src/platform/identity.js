import { isLoopbackHostname } from "./store.js";

function primaryEmail(user) {
  if (!user?.emailAddresses?.length) return "";
  const primary = user.emailAddresses.find((entry) => entry.id === user.primaryEmailAddressId) || user.emailAddresses[0];
  return primary?.emailAddress?.trim().toLowerCase() || "";
}

function normalizeRole(value) {
  return new Set(["student", "tutor", "admin"]).has(value) ? value : "student";
}

export function createPlatformIdentityResolver({
  localDemoMode = false,
  clerkConfigured = false,
  getAuth,
  clerkClient,
  ensureRole,
} = {}) {
  return async function resolveIdentity(req) {
    if (localDemoMode && isLoopbackHostname(req.hostname)) {
      const role = req.get("x-demo-role") === "admin" ? "admin" : "student";
      return role === "admin"
        ? { userId: "demo-admin", role, email: "admin.demo@sleekacademia.local", fullName: "Sleek Academia Admin", demo: true }
        : { userId: "demo-client", role, email: "max.demo@sleekacademia.local", fullName: "Max Demo", demo: true };
    }

    if (!clerkConfigured || typeof getAuth !== "function" || !clerkClient) return null;
    const auth = getAuth(req);
    if (!auth?.isAuthenticated || !auth.userId) return null;
    const user = await clerkClient.users.getUser(auth.userId);
    const role = normalizeRole(await ensureRole(user));
    const email = primaryEmail(user);
    return {
      userId: user.id,
      role,
      email,
      fullName: [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || email || "Sleek Academia User",
      demo: false,
    };
  };
}
