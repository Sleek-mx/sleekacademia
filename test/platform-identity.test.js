import assert from "node:assert/strict";
import test from "node:test";

import { createPlatformIdentityResolver } from "../src/platform/identity.js";

function request({ host = "sleekacademia.com", role = "" } = {}) {
  return {
    hostname: host,
    get(name) {
      return name.toLowerCase() === "x-demo-role" ? role : "";
    },
  };
}

test("MCX admin sessions resolve before Clerk client identity", async () => {
  const resolveIdentity = createPlatformIdentityResolver({
    resolveAdminIdentity: async () => ({ userId: "admin:mcx", role: "admin", fullName: "MCX", demo: false }),
    clerkConfigured: true,
    getAuth: () => ({ isAuthenticated: true, userId: "clerk-user" }),
    clerkClient: { users: { getUser: async () => ({ id: "clerk-user", emailAddresses: [] }) } },
    ensureRole: async () => "student",
  });

  assert.equal((await resolveIdentity(request())).userId, "admin:mcx");
});

test("Clerk users cannot become the MCX administrator through metadata", async () => {
  const resolveIdentity = createPlatformIdentityResolver({
    resolveAdminIdentity: async () => null,
    clerkConfigured: true,
    getAuth: () => ({ isAuthenticated: true, userId: "clerk-user" }),
    clerkClient: {
      users: {
        getUser: async () => ({
          id: "clerk-user",
          firstName: "Client",
          lastName: "User",
          primaryEmailAddressId: "email-1",
          emailAddresses: [{ id: "email-1", emailAddress: "client@example.com" }],
        }),
      },
    },
    ensureRole: async () => "admin",
  });

  const identity = await resolveIdentity(request());
  assert.equal(identity.role, "student");
  assert.equal(identity.userId, "clerk-user");
});

test("localhost demo admin remains loopback-only", async () => {
  const resolveIdentity = createPlatformIdentityResolver({ localDemoMode: true });
  assert.equal((await resolveIdentity(request({ host: "localhost", role: "admin" }))).role, "admin");
  assert.equal(await resolveIdentity(request({ host: "sleekacademia.com", role: "admin" })), null);
});
