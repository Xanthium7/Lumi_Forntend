"use server";

import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

interface GenerateAnimationResponse {
  status: string;
  message: string;
  class_name: string;
  original_class_name: string;
  video_path: string;
  relative_path: string;
  manim_code: string;
  filtered_prompt: string;
}

interface LatestCodeResponse {
  status: string;
  manim_code: string;
  class_name: string;
  filename: string;
}

interface VideoListResponse {
  status: string;
  videos: Array<{
    class_name: string;
    filename: string;
    has_background_music: boolean;
    relative_path: string;
  }>;
  total_count: number;
}

const API_BASE_URL = "http://localhost:8000";

export async function generateAnimation(
  prompt: string
): Promise<GenerateAnimationResponse> {
  try {
    console.log("Sending request to FastAPI backend:", prompt);

    const response = await fetch(`${API_BASE_URL}/generate-animation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
      // Set timeout to 12 minutes (720000ms) to accommodate 10-minute processing time
      signal: AbortSignal.timeout(720000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("FastAPI error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("FastAPI response:", data);
    return data;
  } catch (error) {
    console.log("Error generating animation:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to FastAPI backend. Please ensure it is running on localhost:8000"
      );
    }
    throw new Error(
      `Failed to generate animation: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function getLatestCode(): Promise<LatestCodeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/code/latest`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      // Set timeout to 30 seconds for code fetching
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching latest code:", error);
    throw new Error("Failed to fetch latest code.");
  }
}

export async function getVideoUrl(className: string): Promise<string> {
  try {
    // Use the same download approach for consistency
    return await getVideoWithMusicUrl(className);
  } catch (error) {
    console.log("Error getting video URL:", error);
    throw new Error("Failed to get video URL.");
  }
}

export async function getOriginalVideoUrl(className: string): Promise<string> {
  try {
    // Return the direct URL to the original video endpoint
    return `${API_BASE_URL}/video/original/${className}`;
  } catch (error) {
    console.error("Error getting original video URL:", error);
    throw new Error("Failed to get original video URL.");
  }
}

export async function getVideoWithMusicUrl(className: string): Promise<string> {
  try {
    console.log("Downloading video for class:", className);

    // Create videos directory if it doesn't exist
    const videosDir = path.join(process.cwd(), "public", "videos");
    if (!existsSync(videosDir)) {
      await mkdir(videosDir, { recursive: true });
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${className}_${timestamp}.mp4`;
    const filePath = path.join(videosDir, filename);
    const publicPath = `/videos/${filename}`;

    // Download video from FastAPI backend
    const fastApiUrl = `${API_BASE_URL}/video/${className}`;
    console.log(`Fetching video from: ${fastApiUrl}`);

    const response = await fetch(fastApiUrl, {
      method: "GET",
      headers: {
        Accept: "video/mp4",
      },
    });

    if (!response.ok) {
      console.log(`FastAPI error: ${response.status} ${response.statusText}`);
      throw new Error(
        `Video not found for class: ${className}. Status: ${response.status}`
      );
    }

    // Get video data as buffer
    const videoBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(videoBuffer);

    // Save video to public/videos directory
    await writeFile(filePath, uint8Array);

    console.log(`Video saved successfully: ${publicPath}`);

    // Return the local public URL
    return publicPath;
  } catch (error) {
    console.error("Error downloading video:", error);
    throw new Error(
      `Failed to download video: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function checkVideoExists(className: string): Promise<boolean> {
  try {
    // Check if video exists on FastAPI backend before downloading
    const response = await fetch(`${API_BASE_URL}/video/${className}`, {
      method: "GET",
      headers: {
        Accept: "video/mp4",
        Range: "bytes=0-1", // Request only first few bytes to check existence
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    return response.ok;
  } catch (error) {
    console.error("Error checking video existence:", error);
    return false;
  }
}

export async function listAvailableVideos(): Promise<VideoListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/videos/list`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      // Set timeout to 30 seconds for video listing
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error listing videos:", error);
    throw new Error("Failed to list videos.");
  }
}

export async function downloadAnimationVideo(
  className: string
): Promise<string> {
  try {
    console.log("Downloading animation video for class:", className);

    // Use the same download logic as getVideoWithMusicUrl
    return await getVideoWithMusicUrl(className);
  } catch (error) {
    console.error("Error downloading animation video:", error);
    throw new Error(
      `Failed to download animation video: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function checkServerHealth(): Promise<{ status: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      // Reduce timeout to 5 seconds for health check
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Server health check successful:", data);
    return data;
  } catch (error) {
    console.log("Error checking server health:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("FastAPI server is not reachable at localhost:8000");
    }
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error("FastAPI server is not responding (timeout)");
    }
    throw new Error("Server health check failed");
  }
}
