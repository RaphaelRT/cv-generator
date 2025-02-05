import { promises as fs } from "fs";
import { join } from "path";

/**
 * Cleans a text string by removing unnecessary spaces and lines.
 * @param input - The raw text to clean
 * @returns Cleaned text
 */
export function cleanText(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

/**
 * Reads the content of a text file.
 * @param fileName - The name of the file to read
 * @returns The content of the file as a string
 */
export async function readTextFile(fileName: string): Promise<string> {
  try {
    const filePath = join(__dirname, fileName);
    const data = await fs.readFile(filePath, "utf-8");
    return String(data);
  } catch (error) {
    console.error(`Error reading file ${fileName}:`, error);
    throw error;
  }
}

function generateRandomId(length = 16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
export function generateFileName() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `file_${generateRandomId(5)}_${timestamp}.json`;
}