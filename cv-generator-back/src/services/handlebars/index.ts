import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import { generateFileName } from "../../utils/fileUtils";

Handlebars.registerHelper("highlightKeywords", (text: string, jsonHighlightedKeywords: any) => {
    if (!text) return "";
    const words = Array.isArray(jsonHighlightedKeywords)
        ? jsonHighlightedKeywords
        : typeof jsonHighlightedKeywords === "string"
        ? [jsonHighlightedKeywords]
        : [];
    const regex = new RegExp(`\\b(${words.join("|")})\\b`, "gi");
    return text.replace(regex, "<b>$1</b>");
});

function encodeFontToBase64(fontPath: string): string {
    const fontBuffer = fs.readFileSync(fontPath);
    return `data:font/woff2;base64,${fontBuffer.toString("base64")}`;
}

function getFontsFromDirectory(basePath: string): { name: string; path: string }[] {
    const fontsDir = path.join(basePath, "fonts");
    if (!fs.existsSync(fontsDir)) return [];

    return fs.readdirSync(fontsDir).map((fontFile) => ({
        name: path.parse(fontFile).name,
        path: path.join("fonts", fontFile),
    }));
}

function generateInlineCss(basePath: string): string {
    const cssFilePath = path.join(basePath, "styles/main.css");
    if (!fs.existsSync(cssFilePath)) {
        throw new Error(`CSS file not found: ${cssFilePath}`);
    }

    let cssContent = fs.readFileSync(cssFilePath, "utf8");
    const fonts = getFontsFromDirectory(basePath);

    fonts.forEach((font) => {
        const fontPath = path.join(basePath, font.path);
        if (fs.existsSync(fontPath)) {
            const fontBase64 = encodeFontToBase64(fontPath);
            cssContent = cssContent.replace(new RegExp(`url\\(.*${font.path.replace(/\./g, "\\.")}.*\\)`, "g"), `url(${fontBase64})`);
        }
    });

    return `<style>${cssContent}</style>`;
}

export async function generatePdfFromJson(jsonData: any, templatePath: string): Promise<string> {
    const templateSource = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(templateSource);

    const basePath = path.resolve(__dirname, "../../templates/");
    const inlineCss = generateInlineCss(basePath);

    const htmlContent = template({
        ...jsonData,
        inlineCss,
    });

    const fileName = generateFileName();
    const outputDir = path.join("./output", fileName.replace(".json", ""));
    const pdfPath = path.join(outputDir, `${fileName}.pdf`);
    const jsonPath = path.join(outputDir, `${fileName}.json`);
    const htmlPath = path.join(outputDir, `${fileName}.html`);

    fs.mkdirSync(outputDir, { recursive: true });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "load" });

    await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
    });

    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
    fs.writeFileSync(htmlPath, htmlContent);

    await browser.close();
    return pdfPath;
}
