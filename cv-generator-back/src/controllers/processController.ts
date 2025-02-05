import { Request, Response, NextFunction } from 'express';
import { generatePrompt } from '../utils/generatePrompt';
import { readTextFile } from '../utils/fileUtils';
import { getResponseFromOpenAI } from '../services/openai';
import { generatePdfFromJson } from '../services/handlebars';
import path from "path";
import { createOffer, upsertOffer } from '../services/offersDb';

export const processData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { link, gender, fileContent, offerContent } = req.body;
    const file = fileContent;
    console.log(`Process started : ${link}`)
    if (!link || !gender || !file || !offerContent) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const jsonContent = file
    const jsonData = await getResponseFromOpenAI(gender, offerContent, jsonContent, link)
    const templatePath = path.join(__dirname, "../templates/index.hbs");
    const pdfPath = await generatePdfFromJson(jsonData, templatePath)
    const publicPdfUrl = `${req.protocol}://${req.get("host")}/${pdfPath.replace('./output', 'public/output')}`;
    if (jsonData.offer){
      let  { posted_date, company_description, company, link, summary, recommendations, job_title } = jsonData.offer
      let parsedPostedAt = /^\d{4}-\d{2}-\d{2}$/.test(posted_date) ? new Date(posted_date) : new Date();
      const extractFilename = (url: string) => url.match(/file_[^\/]+(?=\.json)/)?.[0] || null;
      let cv_name_re = extractFilename(publicPdfUrl) || ""
      await upsertOffer({
        posted_at: parsedPostedAt,
        company,
        link,
        content: summary,
        recommendations,
        cv_name: cv_name_re,
        cv_link: publicPdfUrl,
        job_title: job_title,
        company_description
      }, ["posted_at", "company", "job_title"])
    }
    
    
    res.status(200).json({ 
      success: true, 
      data: jsonData,
      pdfLink: publicPdfUrl 
    });
  } catch (error) {
    next(error);
  }
};
