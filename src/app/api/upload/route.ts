import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.IMGBB_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "IMGBB_KEY is not configured in .env" },
        { status: 500 }
      );
    }

    const imgbbFormData = new FormData();
    imgbbFormData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: imgbbFormData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { error: result?.error?.message || "ImgBB upload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: result.data.url,
      display_url: result.data.display_url,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal upload error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
