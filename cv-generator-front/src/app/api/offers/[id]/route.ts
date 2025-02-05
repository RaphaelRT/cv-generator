import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://localhost:3003/offers"; // Remplace par l'URL de ton backend Node.js

// GET an offer by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${API_URL}/${params.id}`);
    if (!response.ok) throw new Error("Offer not found");
    const offer = await response.json();
    return NextResponse.json(offer);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 404 });
  }
}

// PUT update an offer by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const response = await fetch(`${API_URL}/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Failed to update offer");
    const updatedOffer = await response.json();
    return NextResponse.json(updatedOffer);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE an offer by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${API_URL}/${params.id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete offer");
    return NextResponse.json({ message: "Offer deleted successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
