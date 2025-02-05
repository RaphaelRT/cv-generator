import pool from "./database";
import fs from 'fs/promises';
import path from 'path';
import { Offer } from "../../models/offer";

export async function createOffer(offer: Offer) {
  const result = await pool.query(
    `INSERT INTO offers (posted_at, company, link, content, recommendations, cv_name, cv_link, job_title, company_description) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
     RETURNING *`,
    [
      offer.posted_at,
      offer.company,
      offer.link,
      offer.content,
      offer.recommendations ?? "",
      offer.cv_name,
      offer.cv_link,
      offer.job_title,
      offer.company_description
    ]
  );
  return result.rows[0];
}

export async function getOffers() {
  const result = await pool.query("SELECT * FROM offers ORDER BY created_at DESC");
  return result.rows;
}

export async function getOfferById(id: number) {
  const result = await pool.query("SELECT * FROM offers WHERE id = $1", [id]);
  return result.rows[0];
}

export async function updateOffer(id: number, offer: Partial<Offer>) {
  const result = await pool.query(
    `UPDATE offers 
     SET posted_at = COALESCE($1, posted_at),
         company = COALESCE($2, company),
         link = COALESCE($3, link),
         content = COALESCE($4, content),
         recommendations = COALESCE($5, recommendations),
         cv_name = COALESCE($6, cv_name),
         cv_link = COALESCE($7, cv_link),
         updated_at = NOW(),
         job_title = COALESCE($8, job_title),
         company_description = COALESCE($9, company_description)
     WHERE id = $10
     RETURNING *`,
    [
      offer.posted_at,
      offer.company,
      offer.link,
      offer.content,
      offer.recommendations,
      offer.cv_name,
      offer.cv_link,
      offer.job_title,
      offer.company_description,
      id
    ]
  );
  return result.rows[0];
}

export async function deleteOffer(id: number) {
  const result = await pool.query("SELECT cv_name FROM offers WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return { message: "Offer not found" };
  }

  const cvName = result.rows[0].cv_name;
  const folderPath = path.resolve(__dirname, "../../../output", cvName);
  try {
    await pool.query("DELETE FROM offers WHERE id = $1", [id]);
    await fs.rm(folderPath, { recursive: true, force: true });
    return { message: "Offer and folder deleted" };
  } catch (error) {
    console.error("Error deleting offer and folder:", error);
    throw new Error("An error occurred while deleting the offer and its folder.");
  }
}

export async function upsertOffer(offer: Offer, uniqueFields: string[] = ["company", "job_title"]) {
  const conditions = uniqueFields.map((field, index) => `${field} = $${index + 1}`).join(" AND ");
  const values = uniqueFields.map((field) => (offer as any)[field]);

  const existingOffer = await pool.query(
    `SELECT * FROM offers WHERE ${conditions} LIMIT 1`,
    values
  );

  if (existingOffer.rows.length > 0) {
    const id = existingOffer.rows[0].id;
    const result = await pool.query(
      `UPDATE offers 
       SET posted_at = COALESCE($1, posted_at),
           company = COALESCE($2, company),
           link = COALESCE($3, link),
           content = COALESCE($4, content),
           recommendations = COALESCE($5, recommendations),
           cv_name = COALESCE($6, cv_name),
           cv_link = COALESCE($7, cv_link),
           updated_at = NOW(),
           job_title = COALESCE($8, job_title),
           company_description = COALESCE($9, company_description)
       WHERE id = $10
       RETURNING *`,
      [
        offer.posted_at,
        offer.company,
        offer.link,
        offer.content,
        offer.recommendations ?? "",
        offer.cv_name,
        offer.cv_link,
        offer.job_title,
        offer.company_description,
        id
      ]
    );
    return result.rows[0];
  } else {
    const result = await pool.query(
      `INSERT INTO offers (posted_at, company, link, content, recommendations, cv_name, cv_link, job_title, company_description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [
        offer.posted_at,
        offer.company,
        offer.link,
        offer.content,
        offer.recommendations ?? "",
        offer.cv_name,
        offer.cv_link,
        offer.job_title,
        offer.company_description
      ]
    );
    return result.rows[0];
  }
}
