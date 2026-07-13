import path from "node:path";
import { TextDecoder } from "node:util";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const FILE_TYPES = new Map([
  ["application/pdf", { extensions: new Set([".pdf"]), signature: "pdf" }],
  ["image/jpeg", { extensions: new Set([".jpg", ".jpeg"]), signature: "jpeg" }],
  ["image/png", { extensions: new Set([".png"]), signature: "png" }],
  ["image/webp", { extensions: new Set([".webp"]), signature: "webp" }],
  ["text/plain", { extensions: new Set([".txt"]), signature: "text" }],
  ["application/msword", { extensions: new Set([".doc"]), signature: "ole" }],
  ["application/vnd.ms-excel", { extensions: new Set([".xls"]), signature: "ole" }],
  ["application/vnd.ms-powerpoint", { extensions: new Set([".ppt"]), signature: "ole" }],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", { extensions: new Set([".docx"]), signature: "docx" }],
  ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", { extensions: new Set([".xlsx"]), signature: "xlsx" }],
  ["application/vnd.openxmlformats-officedocument.presentationml.presentation", { extensions: new Set([".pptx"]), signature: "pptx" }],
]);

function sanitizeFileName(value) {
  const basename = path.posix.basename(String(value || "").replace(/\\/g, "/")).slice(0, 180);
  return basename
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f/:]+/g, "-")
    .replace(/[^\p{L}\p{N}._() -]+/gu, "-")
    .replace(/[ -]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 180);
}

function startsWith(bytes, signature) {
  return bytes.length >= signature.length && signature.every((value, index) => bytes[index] === value);
}

function isUtf8Text(bytes) {
  if (bytes.includes(0)) return false;
  let decoded;
  try {
    decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return false;
  }
  if (!decoded.trim()) return false;
  let controls = 0;
  for (const character of decoded) {
    const code = character.codePointAt(0);
    if ((code < 32 && !new Set([9, 10, 13]).has(code)) || code === 127) controls += 1;
  }
  return controls / Math.max(decoded.length, 1) < 0.01;
}

function hasSignature(bytes, type) {
  if (startsWith(bytes, [0x4d, 0x5a])) return false;
  if (type === "pdf") {
    return bytes.subarray(0, 5).toString("ascii") === "%PDF-" && bytes.subarray(-1024).includes(Buffer.from("%%EOF"));
  }
  if (type === "jpeg") return startsWith(bytes, [0xff, 0xd8, 0xff]) && bytes.at(-2) === 0xff && bytes.at(-1) === 0xd9;
  if (type === "png") return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (type === "webp") return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  if (type === "ole") return startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
  if (type === "text") return isUtf8Text(bytes);
  const zip = startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]);
  if (!zip) return false;
  const searchable = bytes.toString("latin1");
  if (!searchable.includes("[Content_Types].xml")) return false;
  if (type === "docx") return searchable.includes("word/");
  if (type === "xlsx") return searchable.includes("xl/");
  if (type === "pptx") return searchable.includes("ppt/");
  return false;
}

function decodeBase64(value) {
  if (typeof value !== "string" || !value || value.length % 4 === 1 || !/^[A-Za-z0-9+/]*={0,2}$/.test(value)) return null;
  if (value.length > Math.ceil(MAX_UPLOAD_BYTES / 3) * 4 + 4) return { tooLarge: true };
  const bytes = Buffer.from(value, "base64");
  if (bytes.toString("base64").replace(/=+$/, "") !== value.replace(/=+$/, "")) return null;
  return { bytes };
}

export function validateUpload(input) {
  const fileName = sanitizeFileName(input?.fileName);
  if (!fileName) return { error: "File name is required." };
  const mimeType = typeof input?.mimeType === "string" ? input.mimeType.trim().toLowerCase().slice(0, 160) : "";
  const type = FILE_TYPES.get(mimeType);
  if (!type) return { error: "This file type is not supported." };
  const extension = path.extname(fileName).toLowerCase();
  if (!type.extensions.has(extension)) return { error: "The file extension and MIME type do not match." };
  const decoded = decodeBase64(input?.contentBase64);
  if (!decoded) return { error: "File content is invalid." };
  if (decoded.tooLarge) return { error: "Files must be 8 MB or smaller." };
  const { bytes } = decoded;
  if (!bytes.length) return { error: "The uploaded file is empty." };
  if (bytes.length > MAX_UPLOAD_BYTES) return { error: "Files must be 8 MB or smaller." };
  if (!hasSignature(bytes, type.signature)) return { error: "The file content does not match its declared type or signature." };
  return { fileName, mimeType, bytes };
}
