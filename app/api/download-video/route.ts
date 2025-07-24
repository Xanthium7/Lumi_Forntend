import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { className } = await request.json();

    if (!className) {
      return NextResponse.json(
        { error: "Class name is required" },
        { status: 400 }
      );
    }

    console.log(`Downloading video for class: ${className}`);

    // Create videos directory if it doesn't exist
    const videosDir = path.join(process.cwd(), "public", "videos");
    if (!existsSync(videosDir)) {
      await mkdir(videosDir, { recursive: true });
    }

    // Delete all files in videos directory
    const fs = await import("fs");
    const files = fs.readdirSync(videosDir);
    for (const file of files) {
      fs.promises.unlink(path.join(videosDir, file));
    }

    // Use className.mp4 as filename
    const filename = `${className}.mp4`;
    const filePath = path.join(videosDir, filename);
    const publicPath = `/videos/${filename}`;

    // Download video from FastAPI backend
    const fastApiUrl = `http://localhost:8000/video/${className}`;
    console.log(`Fetching video from: ${fastApiUrl}`);

    const response = await fetch(fastApiUrl, {
      method: "GET",
      headers: {
        Accept: "video/mp4",
      },
    });

    if (!response.ok) {
      console.error(`FastAPI error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Video not found for class: ${className}` },
        { status: response.status }
      );
    }

    // Get video data as buffer
    const videoBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(videoBuffer);

    // Save video to public/videos directory
    await writeFile(filePath, uint8Array);

    console.log(`Video saved successfully: ${publicPath}`);

    return NextResponse.json({
      success: true,
      videoUrl: publicPath,
      className: className,
      filename: filename,
      message: `Video downloaded and saved as ${filename}`,
    });
  } catch (error) {
    console.error("Video download error:", error);
    return NextResponse.json(
      {
        error: "Failed to download video",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
