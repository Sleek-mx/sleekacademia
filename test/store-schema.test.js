import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { STORE_PRODUCTS, formatPrice, productUrl } from "../src/data/store-products.js";
import { buildGraph, render, summarySentence } from "../scripts/build-store-schema.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const storeHtml = fs.readFileSync(path.join(repoRoot, "public", "store.html"), "utf8");

function graphFromPage(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(blocks.length, 1, "store.html should carry exactly one JSON-LD block");
  return JSON.parse(blocks[0][1]);
}

function productsFromGraph(graph) {
  const list = graph["@graph"].find((node) => node["@type"] === "ItemList");
  assert.ok(list, "ItemList node missing");
  return list.itemListElement.map((entry) => entry.item);
}

test("store.html is regenerated from the product data file", () => {
  assert.equal(render(storeHtml), storeHtml, "store.html is stale — run: npm run build:store");
});

test("every offer carries both price and priceCurrency", () => {
  // This is the exact Search Console error from 2026-08: offers had priceCurrency and no price.
  for (const product of productsFromGraph(graphFromPage(storeHtml))) {
    const offer = product.offers;
    assert.ok(offer, `${product.sku}: no offers`);
    assert.match(offer.price, /^\d+\.\d{2}$/, `${product.sku}: offers.price must be a decimal string`);
    assert.match(offer.priceCurrency, /^[A-Z]{3}$/, `${product.sku}: offers.priceCurrency must be ISO 4217`);
    assert.ok(offer.availability?.startsWith("https://schema.org/"), `${product.sku}: availability`);
  }
});

test("every product satisfies Google's required and identifier fields", () => {
  for (const product of productsFromGraph(graphFromPage(storeHtml))) {
    assert.ok(product.name?.length > 0, `${product.sku}: name`);
    assert.match(product.image, /^https:\/\//, `${product.sku}: image must be an absolute https URL`);
    assert.ok(product.brand?.name, `${product.sku}: brand is the global identifier for these products`);
    assert.ok(product.sku, "sku");
    assert.ok(product.offers.hasMerchantReturnPolicy, `${product.sku}: hasMerchantReturnPolicy`);
  }
});

test("the JSON-LD covers every product in the data file, in order", () => {
  const marked = productsFromGraph(graphFromPage(storeHtml));
  assert.equal(marked.length, STORE_PRODUCTS.length, "a product was added without rebuilding store.html");
  for (const [index, product] of STORE_PRODUCTS.entries()) {
    assert.equal(marked[index].sku, product.sku);
    assert.equal(marked[index].offers.price, product.price);
    assert.equal(marked[index].url, productUrl(product));
  }
});

test("visible card copy matches the offer it describes", () => {
  for (const product of STORE_PRODUCTS) {
    assert.ok(
      storeHtml.includes(`${formatPrice(product)} &middot; one-time digital purchase`),
      `${product.sku}: card price copy missing`,
    );
    assert.ok(storeHtml.includes(`${productUrl(product)}?wanted=true`), `${product.sku}: card link missing`);
  }
  assert.ok(storeHtml.includes(summarySentence()), "store terms sentence is stale");
});

test("ratings are never fabricated", () => {
  // The store has no review system. aggregateRating/review stay absent until real reviews exist;
  // if a rating is ever added to the data file it has to be backed by a positive review count.
  for (const product of STORE_PRODUCTS) {
    if (!product.rating) continue;
    assert.ok(product.rating.reviewCount > 0, `${product.sku}: aggregateRating needs a real reviewCount`);
    assert.ok(Number(product.rating.ratingValue) > 0, `${product.sku}: aggregateRating needs a real ratingValue`);
  }
  const emitted = productsFromGraph(buildGraph());
  for (const [index, product] of STORE_PRODUCTS.entries()) {
    assert.equal(
      Boolean(emitted[index].aggregateRating),
      Boolean(product.rating),
      `${product.sku}: aggregateRating must track real data only`,
    );
  }
});
