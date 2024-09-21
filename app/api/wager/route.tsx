// app/api/saveToKV/route.tsx
import { createClient } from "@vercel/kv"; // Vercel KV import
import { NextResponse } from "next/server";
import { uuid } from "uuidv4";
interface CustomFrame {
  title: string;
  createdByFid: string;
  yesVoters: string[];
  noVoters: string[];
}

export async function POST(request: Request) {
  try {
    const customFramesDb = createClient({
        url: process.env.KV_CUSTOM_REST_API_URL,
        token: process.env.KV_CUSTOM_REST_API_TOKEN,
      });
    // Parse the request body
    const body = await request.json();
    const { title, createdByFid } = body;
    const id = uuid();

    // Validate input (basic validation)
    if (!title || !createdByFid) {
      return NextResponse.json(
        { error: "Name and creator are required." },
        { status: 400 }
      );
    }

    // Save to Vercel KV
    const x = await customFramesDb.hset(id, {
      title,
      createdByFid,
      yesVoters: [],
      noVoters: [],
    });
    console.log(x);
    // Respond with success
    return NextResponse.json({
      success: true,
      message: "Data saved successfully.",
      id,
    });
  } catch (error) {
    console.error("Error saving data to Vercel KV:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while saving data." },
      { status: 500 }
    );
  }
}
