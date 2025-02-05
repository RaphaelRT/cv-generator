import express from "express";
import {
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
} from "../services/offersDb";

const router = express.Router();

// Create an offer
router.post("/", async (req, res) => {
  const offer = await createOffer(req.body);
  res.json(offer);
});

// Get all offers
router.get("/", async (_req, res) => {
  const offers = await getOffers();
  res.json(offers);
});

// Get an offer by ID
router.get("/:id", async (req, res) => {
  const offer = await getOfferById(parseInt(req.params.id));
  if (offer) res.json(offer);
  else res.status(404).json({ error: "Offer not found" });
});

// Update an offer
router.put("/:id", async (req, res) => {
  const offer = await updateOffer(parseInt(req.params.id), req.body);
  res.json(offer);
});

// Delete an offer
router.delete("/:id", async (req, res) => {
  const result = await deleteOffer(parseInt(req.params.id));
  res.json(result);
});

export default router;
