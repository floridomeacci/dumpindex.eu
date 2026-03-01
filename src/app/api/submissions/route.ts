import { NextRequest, NextResponse } from "next/server";
import { getSubmissions, addSubmission } from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export async function GET() {
  try {
    const submissions = await getSubmissions();
    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const city = formData.get("city") as string;
    const country = formData.get("country") as string;
    const caption = formData.get("caption") as string;
    const image = formData.get("image") as File;

    if (!city || !country || !caption || !image) {
      return NextResponse.json(
        { error: "Missing required fields: city, country, caption, image" },
        { status: 400 }
      );
    }

    // Save image
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = image.name.split(".").pop() || "jpg";
    const filename = `${generateId()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    const submission = {
      id: generateId(),
      city: city.trim(),
      country: country.trim(),
      imageUrl: `/uploads/${filename}`,
      caption: caption.trim(),
      submittedAt: new Date().toISOString(),
      votes: 0,
    };

    await addSubmission(submission);

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
  }
}
