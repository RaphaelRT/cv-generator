import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://localhost:3003/offers"; // Remplace par l'URL de ton backend Node.js

// GET all offers
export async function GET() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch offers");
    const offers = await response.json();
    return NextResponse.json(offers);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST create a new offer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Failed to create offer");
    const offer = await response.json();
    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
