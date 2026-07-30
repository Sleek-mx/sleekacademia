import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const publicPages = ["index.html", "about.html", "blog.html", "store.html"];
const workspacePages = ["dashboard.html", "admin.html", "client-order.html", "admin-order.html", "login.html", "sign-up.html", "onboard.html"];

test("public pages load the neumorphic layer after the structural brand stylesheet", () => {
  for (const page of publicPages) {
    const html = read(`public/${page}`);
    const brandIndex = html.indexOf('/css/brand-v2.css');
    const neumorphicIndex = html.indexOf('/css/public-neumorphic.css');

    assert.notEqual(brandIndex, -1, `${page} must keep brand-v2.css`);
    assert.ok(neumorphicIndex > brandIndex, `${page} must load public-neumorphic.css after brand-v2.css`);
  }
});

test("workspace and dashboard pages remain isolated from the public theme", () => {
  for (const page of workspacePages) {
    assert.doesNotMatch(read(`public/${page}`), /public-neumorphic\.css/, `${page} must keep its existing workspace theme`);
  }
});

test("public theme contains the canonical raised and inset soft UI primitives", () => {
  const css = read("public/css/public-neumorphic.css");

  for (const value of ["#e7e4f1", "#c3bdd8", "#ffffff", "#372f52", "#6b6488", "#702ae1", "#9d6bff"]) {
    assert.match(css, new RegExp(value, "i"), `missing canonical token ${value}`);
  }
  assert.match(css, /--public-neu-raised:\s*[^;]*#c3bdd8[^;]*#ffffff/i);
  assert.match(css, /--public-neu-pressed:\s*inset[^;]*#c3bdd8[^;]*inset[^;]*#ffffff/i);
});

test("public theme covers the existing interactive and content surfaces", () => {
  const css = read("public/css/public-neumorphic.css");

  for (const selector of [
    ".site-nav",
    ".platform-header",
    ".button--primary",
    ".button--secondary",
    ".hero__media",
    ".platform-art-card",
    ".blog-card",
    ".product-card-v2",
    ".platform-footer",
    ".menu-button",
  ]) {
    assert.ok(css.includes(selector), `missing public theme coverage for ${selector}`);
  }
  assert.match(css, /@media\s*\(max-width:\s*48rem\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});
