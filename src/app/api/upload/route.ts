import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || "upload.jpg";
    const extension = originalName.split(".").pop()?.toLowerCase() || "jpg";
    const baseName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 50);

    const uniqueFileName = `${Date.now()}_${baseName}.${extension}`;

    // Attempt writing to public/uploads if local disk is available
    let localUrl = `/uploads/${uniqueFileName}`;
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, uniqueFileName);
      await writeFile(filePath, buffer);
    } catch {
      // Ignored for ephemeral / serverless read-only filesystems
    }

    // If it's an image under 4.5MB, generate Base64 data URL so it's 100% durable on Vercel/cloud
    let dataUrl = "";
    const isImage =
      file.type?.startsWith("image/") ||
      ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(extension);

    if (isImage && buffer.length < 4.5 * 1024 * 1024) {
      const mime =
        file.type || (extension === "jpg" ? "image/jpeg" : `image/${extension}`);
      dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    }

    const finalUrl = dataUrl || localUrl;

    const sizeInMB = file.size / (1024 * 1024);
    const sizeFormatted =
      sizeInMB >= 1
        ? `${sizeInMB.toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    return NextResponse.json({
      success: true,
      url: finalUrl,
      previewUrl: finalUrl,
      fileName: uniqueFileName,
      originalName,
      fileSize: sizeFormatted,
      fileType: extension,
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

