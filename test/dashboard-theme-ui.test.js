import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("dashboard glass system uses only the approved Sleek Academia palette", () => {
  const css = read("public/css/dashboard-glass.css");

  assert.match(css, /--dash-canvas:\s*#e7e4f1/i);
  assert.match(css, /\[data-theme=["']night["']\][\s\S]*--dash-canvas:\s*#12233b/i);
  for (const color of ["#702ae1", "#9d6bff", "#078fec", "#12c8ae", "#42c83f", "#ff9c0a", "#ed3489", "#ffd51a"]) {
    assert.match(css.toLowerCase(), new RegExp(color));
  }
  assert.match(css, /backdrop-filter:\s*blur\(/);
  assert.match(css, /prefers-reduced-transparency:\s*reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media\s*\(max-width:\s*767px\)/);
  assert.doesNotMatch(css, /workspace-v2\.css/);
});

test("dashboard theme follows system preference until the user chooses a mode", () => {
  const script = read("public/js/dashboard-theme.js");

  assert.match(script, /sleekAcademia\.dashboardTheme\.v1/);
  assert.match(script, /prefers-color-scheme:\s*dark/);
  assert.match(script, /root\.dataset\.theme/);
  assert.match(script, /aria-pressed/);
  assert.match(script, /addEventListener\(["']change["']/);
  assert.match(script, /sleek:dashboard-theme-change/);
  assert.doesNotMatch(script, /innerHTML/);
});
