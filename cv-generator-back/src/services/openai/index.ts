import { OpenAI } from "openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { generatePrompt } from "../../utils/generatePrompt";
import { generateFileName } from "../../utils/fileUtils";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in the .env file");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getResponseFromOpenAI(
  gender: "male" | "female" | "other",
  offerContent: string,
  jsonContent: string,
  link: string
): Promise<any> {
  try {
    const userContent = `Gender: ${gender}, offerContent: ${offerContent}, JSON: ${JSON.stringify(jsonContent)}`;
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: generatePrompt(String(jsonContent), gender, String(offerContent), link) },
        { role: "user", content: userContent },
      ],
      temperature: 0.7,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "";
    const cleanedReply = reply.replace(/```json|```/g, "");

    let parsedJSON;
    try {
    parsedJSON = JSON.parse(cleanedReply);
    } catch (error) {
    throw new Error("Invalid JSON format received from OpenAI");
    }
    return parsedJSON

  } catch (error) {
    console.error("Error during OpenAI interaction:", error);
    throw error;
  }
}
