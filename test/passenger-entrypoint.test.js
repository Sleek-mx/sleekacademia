import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("Passenger can require the server entrypoint and observe a synchronous listener", () => {
  const childScript = `
    const express = require("express");
    const originalListen = express.application.listen;
    express.application.listen = function (...args) {
      console.log("Passenger listen invoked");
      return originalListen.apply(this, args);
    };
    require("./server.js");
    console.log("Passenger require returned");
  `;
  const result = spawnSync(process.execPath, ["-e", childScript], {
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
  assert.ok(
    result.stdout.indexOf("Passenger listen invoked") < result.stdout.indexOf("Passenger require returned"),
    `Passenger requires app.listen() during synchronous entrypoint loading.\n${result.stdout}`
  );
});
