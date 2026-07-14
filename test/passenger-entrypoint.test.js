import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("Passenger can require the server entrypoint without a top-level-await failure", () => {
  const result = spawnSync(process.execPath, ["-e", "require('./server.js')"], {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout: 2500,
    env: {
      ...process.env,
      PORT: "0",
      NODE_ENV: "test",
      LOCAL_DEMO_MODE: "1",
      ADMIN_AUTH_ENABLED: "",
      ADMIN_PASSWORD_HASH: "",
      ADMIN_SESSION_SECRET: "",
    },
  });

  assert.doesNotMatch(result.stderr || "", /ERR_REQUIRE_ASYNC_MODULE/);
  assert.match(result.stdout || "", /Sleek Academia is running/);
});
