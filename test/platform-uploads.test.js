import assert from "node:assert/strict";
import test from "node:test";

import { validateUpload } from "../src/platform/uploads.js";

function upload(fileName, mimeType, bytes) {
  return validateUpload({ fileName, mimeType, contentBase64: bytes.toString("base64") });
}

const fixtures = [
  ["paper.pdf", "application/pdf", Buffer.from("%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF")],
  ["photo.jpg", "image/jpeg", Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0xff, 0xd9])],
  ["chart.png", "image/png", Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0])],
  ["figure.webp", "image/webp", Buffer.from("RIFF\u0010\u0000\u0000\u0000WEBPVP8 ", "binary")],
  ["essay.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", Buffer.from("PK\u0003\u0004[Content_Types].xml word/document.xml", "binary")],
  ["grades.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Buffer.from("PK\u0003\u0004[Content_Types].xml xl/workbook.xml", "binary")],
  ["slides.pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation", Buffer.from("PK\u0003\u0004[Content_Types].xml ppt/presentation.xml", "binary")],
  ["notes.txt", "text/plain", Buffer.from("Readable notes\nwith a second line.\n", "utf8")],
];

test("validates supported binary signatures instead of trusting browser metadata", () => {
  for (const [fileName, mimeType, bytes] of fixtures) {
    const result = upload(fileName, mimeType, bytes);
    assert.equal(result.error, undefined, `${fileName}: ${result.error}`);
    assert.deepEqual(result.bytes, bytes);
  }
});

test("rejects extension, MIME, and signature mismatches", () => {
  const pdf = fixtures[0][2];
  assert.match(upload("paper.pdf", "image/png", pdf).error, /match|type/i);
  assert.match(upload("paper.png", "application/pdf", pdf).error, /match|type/i);
  assert.match(upload("paper.pdf", "application/pdf", Buffer.from("MZ executable")).error, /signature|content|type/i);
  assert.match(upload("archive.docx", fixtures[4][1], Buffer.from("PK\u0003\u0004random.zip", "binary")).error, /document|content|type/i);
});

test("rejects executable, polyglot, and binary text content", () => {
  assert.ok(upload("renamed.pdf", "application/pdf", Buffer.from("MZ\u0090\u0000%PDF-1.7", "binary")).error);
  assert.ok(upload("payload.txt", "text/plain", Buffer.from([0x4d, 0x5a, 0, 1, 2, 3, 4, 5])).error);
  assert.ok(upload("null.txt", "text/plain", Buffer.from("safe\u0000hidden", "binary")).error);
});

test("enforces strict base64, non-empty content, and the eight-megabyte limit", () => {
  assert.ok(validateUpload({ fileName: "paper.pdf", mimeType: "application/pdf", contentBase64: "%%%" }).error);
  assert.ok(validateUpload({ fileName: "paper.pdf", mimeType: "application/pdf", contentBase64: "" }).error);
  assert.match(upload("large.pdf", "application/pdf", Buffer.alloc(8 * 1024 * 1024 + 1, 1)).error, /8 MB/i);
});

test("sanitizes client filenames so paths and headers cannot be injected", () => {
  const result = upload("../../report\r\nX-Injected: yes.pdf", "application/pdf", fixtures[0][2]);
  assert.equal(result.error, undefined);
  assert.equal(result.fileName, "report-X-Injected-yes.pdf");
  assert.doesNotMatch(result.fileName, /[\\/\r\n:]/);
});
