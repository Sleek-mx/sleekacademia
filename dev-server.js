import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Serve public directory as static files
app.use(express.static(path.join(__dirname, "public")));

// Serve assets
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Routes for HTML files
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/pricing.html", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "pricing.html"));
});

app.get("/onboard.html", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "onboard.html"));
});

app.get("/store.html", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "store.html"));
});

app.get("/blog.html", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "blog.html"));
});

app.get("/about.html", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

// Catch-all redirect to index
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Dev server running at http://localhost:${port}`);
});
