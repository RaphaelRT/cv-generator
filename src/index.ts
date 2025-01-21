import express, { Request, Response } from "express";
import http from "http";
import path from "path";
import fs from "fs";
import { WebSocketServer } from "ws";
import puppeteer from "puppeteer";
import hbs from "hbs";
import { highlightedKeywords } from "./highlightedKeywords"

hbs.registerHelper("highlightKeywords", (text: string) => {
  if (!text) return "";
  const regex = new RegExp(`\\b(${highlightedKeywords.join("|")})\\b`, "gi");
  return text.replace(regex, "<b>$1</b>");
});

const app = express();
const PORT = 3000;
const isProduction = false;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "templates"));
app.use(express.static(path.join(__dirname, "assets")));

const jsonDataPath = path.join(__dirname, "assets", "data", "index.json");
let jsonData: Record<string, unknown> = {};

try {
  const data = fs.readFileSync(jsonDataPath, "utf-8");
  jsonData = JSON.parse(data);
} catch (err) {
  console.error("Failed to load JSON data:", err);
}

app.get("/", (req: Request, res: Response) => {
  res.render("index", { ...jsonData, isDev: !isProduction });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
});

if (!isProduction) {
  const watchDirectories = [
    path.join(__dirname, "templates"),
    path.join(__dirname, "assets"),
  ];

  watchDirectories.forEach((dir) => {
    fs.watch(dir, { recursive: true }, (eventType, filename) => {
      if (filename) {
        const fullPath = path.join(dir, filename);
        if (fullPath === jsonDataPath) {
          try {
            const data = fs.readFileSync(jsonDataPath, "utf-8");
            jsonData = JSON.parse(data);
          } catch (err) {
            console.error("Failed to reload JSON data:", err);
          }
        }
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send("reload");
          }
        });
      }
    });
  });
}

app.get("/export-pdf", async (req: Request, res: Response) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle0" });
  const pdfPath = path.join(__dirname, "generated_cv.pdf");

  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  res.contentType("application/pdf");
  res.sendFile(pdfPath);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});