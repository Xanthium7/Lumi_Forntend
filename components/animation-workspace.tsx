"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Play,
  Pause,
  Download,
  Code,
  Eye,
  RefreshCw,
  Settings,
  Maximize2,
  Edit,
  MessageSquare,
  Send,
  User,
  Bot,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import type { AnimationProject, AnimationChunk } from "@/types/animation";
import {
  generateAnimation,
  getVideoUrl,
  getLatestCode,
  checkServerHealth,
  getVideoWithMusicUrl,
  checkVideoExists,
} from "@/actions/actions";

import useWebContainer from "@/hooks/useWebcontainer";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AnimationWorkspaceProps {
  project: AnimationProject;
  onBack: () => void;
}
const files = {
  "app.py": {
    file: {
      contents: `
from manim import *
print("Hello, Manim!")
      `,
    },
  },
};

export default function AnimationWorkspace({
  project,
  onBack,
}: AnimationWorkspaceProps) {
  const [currentProject, setCurrentProject] =
    useState<AnimationProject>(project);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"preview" | "code" | "edit">(
    "preview"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [className, setClassName] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);

  // Form input states
  const [animationTitle, setAnimationTitle] = useState(project.title);
  const [animationPrompt, setAnimationPrompt] = useState(project.prompt);
  const [duration, setDuration] = useState(30);
  const [frameRate, setFrameRate] = useState("60");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm ready to help you create your educational animation using Manim. What would you like to visualize?",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "2",
      type: "user",
      content: currentProject.prompt,
      timestamp: new Date(Date.now() - 180000),
    },
    {
      id: "3",
      type: "assistant",
      content:
        "Great! I'm generating a detailed Manim animation based on your prompt. This will create professional mathematical visualizations.",
      timestamp: new Date(Date.now() - 120000),
    },
  ]);

  // Check server health on component mount
  useEffect(() => {
    const checkServer = async () => {
      try {
        await checkServerHealth();
        setServerStatus("online");
      } catch (error) {
        setServerStatus("offline");
        console.log("Server health check failed:", error);
      }
    };

    checkServer();
  }, []);

  useEffect(() => {
    // Generate animation when component mounts
    const generateAnimationCode = async () => {
      if (serverStatus !== "online") return;

      setIsGenerating(true);
      setGenerationProgress(0);
      setGenerationStep("Initializing...");

      try {
        // Simulate progress updates during generation
        const progressInterval = setInterval(() => {
          setGenerationProgress((prev) => {
            const increment = Math.random() * 15 + 5; // Random increment between 5-20%
            const newProgress = Math.min(prev + increment, 85); // Cap at 85% until completion

            // Update step based on progress
            if (newProgress < 20) {
              setGenerationStep("Processing prompt...");
            } else if (newProgress < 40) {
              setGenerationStep("Generating Manim code...");
            } else if (newProgress < 60) {
              setGenerationStep("Optimizing animations...");
            } else if (newProgress < 80) {
              setGenerationStep("Rendering video...");
            } else {
              setGenerationStep("Finalizing...");
            }

            return newProgress;
          });
        }, 2000); // Update every 2 seconds

        const response = await generateAnimation(currentProject.prompt);

        // Clear progress interval and set to 100%
        clearInterval(progressInterval);
        setGenerationProgress(100);
        setGenerationStep("Complete!");

        setApiResponse(response);
        setGeneratedCode(response.manim_code);
        setClassName(response.class_name);

        // Get video URL
        const videoUrl = await getVideoUrl(response.class_name);
        setVideoUrl(videoUrl);

        // Add success message to chat
        const successMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "assistant",
          content: `✅ Animation generated successfully! Class name: ${response.class_name}`,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, successMessage]);
      } catch (error) {
        console.log("Error generating animation:", error);
        setGenerationProgress(0);
        setGenerationStep("Error occurred");

        // Add error message to chat
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "assistant",
          content: `❌ Error generating animation: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsGenerating(false);
        // Reset progress after a delay
        setTimeout(() => {
          setGenerationProgress(0);
          setGenerationStep("");
        }, 3000);
      }
    };

    generateAnimationCode();
  }, [currentProject.prompt, serverStatus]);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput("");

    // Check if user wants to regenerate or modify the animation
    const isRegenerateRequest =
      currentInput.toLowerCase().includes("regenerate") ||
      currentInput.toLowerCase().includes("modify") ||
      currentInput.toLowerCase().includes("change");

    if (isRegenerateRequest && serverStatus === "online") {
      setIsGenerating(true);
      setGenerationProgress(0);
      setGenerationStep("Regenerating...");

      try {
        // Start progress simulation for regeneration
        const progressInterval = setInterval(() => {
          setGenerationProgress((prev) => {
            const increment = Math.random() * 12 + 8; // Slightly faster for regeneration
            const newProgress = Math.min(prev + increment, 85);

            if (newProgress < 25) {
              setGenerationStep("Processing new prompt...");
            } else if (newProgress < 50) {
              setGenerationStep("Updating Manim code...");
            } else if (newProgress < 75) {
              setGenerationStep("Re-rendering video...");
            } else {
              setGenerationStep("Almost done...");
            }

            return newProgress;
          });
        }, 1500); // Slightly faster updates for regeneration

        // Use the new prompt for regeneration
        const response = await generateAnimation(currentInput);

        clearInterval(progressInterval);
        setGenerationProgress(100);
        setGenerationStep("Regeneration complete!");

        setApiResponse(response);
        setGeneratedCode(response.manim_code);
        setClassName(response.class_name);

        // Get new video URL
        const videoUrl = await getVideoUrl(response.class_name);
        setVideoUrl(videoUrl);

        const successMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: `✅ Animation regenerated successfully! New class: ${response.class_name}`,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, successMessage]);
      } catch (error) {
        setGenerationProgress(0);
        setGenerationStep("Regeneration failed");

        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: `❌ Error regenerating animation: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsGenerating(false);
        setTimeout(() => {
          setGenerationProgress(0);
          setGenerationStep("");
        }, 3000);
      }
    } else {
      // Regular chat response
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content:
            serverStatus === "offline"
              ? "❌ Server is offline. Please ensure the FastAPI backend is running on localhost:8000"
              : "I understand your request. To modify the animation, please include 'regenerate' in your message with the new requirements.",
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, assistantMessage]);
      }, 1000);
    }
  };

  const handleRetryVideoDownload = async () => {
    if (!className || !apiResponse) {
      console.warn("No class name or API response available for retry");
      return;
    }

    setIsRetrying(true);
    try {
      console.log(`Retrying video download for class: ${className}`);

      // Add retry message to chat
      const retryMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "assistant",
        content: `🔄 Retrying video download for class: ${className}`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, retryMessage]);

      // First check if the video exists
      const videoExists = await checkVideoExists(className);
      if (!videoExists) {
        throw new Error(`Video not found for class: ${className}`);
      }

      // Attempt to download the video again
      const videoUrl = await getVideoWithMusicUrl(className);
      setVideoUrl(videoUrl);

      // Add success message to chat
      const successMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `✅ Video download successful! Class: ${className}`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      console.log("Error during video retry:", error);

      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `❌ Video download failed again: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please check if the FastAPI backend is running.`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Top Header */}
      <header className="h-14 bg-black/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-px bg-white/20" />
          <div>
            <h1 className="text-sm font-medium text-white">
              {currentProject.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge
            variant={serverStatus === "online" ? "default" : "secondary"}
            className={
              serverStatus === "online"
                ? "bg-green-500/20 text-green-400"
                : serverStatus === "offline"
                ? "bg-red-500/20 text-red-400"
                : "bg-yellow-500/20 text-yellow-400"
            }
          >
            {serverStatus === "online" && (
              <CheckCircle className="w-3 h-3 mr-1" />
            )}
            {serverStatus === "offline" && <XCircle className="w-3 h-3 mr-1" />}
            {serverStatus === "checking" && <Clock className="w-3 h-3 mr-1" />}
            {serverStatus === "online"
              ? "Server Online"
              : serverStatus === "offline"
              ? "Server Offline"
              : "Checking Server"}
          </Badge>
          <Badge
            variant={isGenerating ? "secondary" : "default"}
            className={
              isGenerating
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-green-500/20 text-green-400"
            }
          >
            {isGenerating ? "Generating" : "Ready"}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            className="bg-white text-black hover:bg-white/90"
            disabled={!videoUrl}
            onClick={() => {
              if (videoUrl) {
                const link = document.createElement("a");
                link.href = videoUrl;
                link.download = `${className || "animation"}.mp4`;
                link.click();
              }
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Chat */}
        <div className="w-80 bg-black/60 border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-2 text-white/80">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">Chat with AI</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex space-x-2 max-w-[80%] ${
                    message.type === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user"
                        ? "bg-violet-600"
                        : "bg-gradient-to-br from-violet-600 to-fuchsia-600"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-violet-600 text-white"
                        : "bg-white/10 text-white/90"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me to modify the animation..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none h-10 min-h-10"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                size="sm"
                onClick={sendMessage}
                disabled={!chatInput.trim()}
                className="bg-violet-600 hover:bg-violet-700 text-white px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview/Code */}
        <div className="flex-1 flex flex-col">
          {/* Tab Controls */}
          <div className="h-12 bg-black/40 border-b border-white/10 flex items-center justify-between px-4">
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "preview" | "code" | "edit")
              }
            >
              <TabsList className="bg-white/5 border border-white/10 h-8">
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-white/10 text-white/80 data-[state=active]:text-white text-xs px-3"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="data-[state=active]:bg-white/10 text-white/80 data-[state=active]:text-white text-xs px-3"
                >
                  <Code className="w-3 h-3 mr-1" />
                  Code
                </TabsTrigger>
                <TabsTrigger
                  value="edit"
                  className="data-[state=active]:bg-white/10 text-white/80 data-[state=active]:text-white text-xs px-3"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-white/60 hover:text-white hover:bg-white/10"
              >
                <Maximize2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "preview" ? (
              <div className="h-full flex flex-col">
                {/* Video Preview */}
                <div className="flex-1 bg-black/20 flex items-center justify-center">
                  <div className="w-full h-full max-w-4xl max-h-[80%] bg-black/60 rounded-lg border border-white/10 flex items-center justify-center m-4">
                    {isGenerating ? (
                      <div className="text-center text-white">
                        <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                        <p className="text-lg font-medium mb-2">
                          Generating Animation
                        </p>
                        <p className="text-sm opacity-60 mb-6">
                          {generationStep ||
                            "Creating your Manim visualization..."}
                        </p>

                        {/* Progress Bar */}
                        <div className="w-80 mx-auto">
                          <div className="flex justify-between text-xs text-white/60 mb-2">
                            <span>Progress</span>
                            <span>{Math.round(generationProgress)}%</span>
                          </div>
                          <Progress
                            value={generationProgress}
                            className="h-2 bg-white/10"
                          />
                          <p className="text-xs text-white/40 mt-2">
                            This may take 5-10 minutes depending on complexity
                          </p>
                        </div>
                      </div>
                    ) : videoUrl ? (
                      <div className="w-full h-full p-4">
                        <video
                          src={videoUrl}
                          controls
                          autoPlay
                          loop
                          className="w-full h-full object-contain rounded-lg"
                          onError={(e) => {
                            console.log("Video load error:", e);
                            // Fallback to show error message
                          }}
                        />
                        {apiResponse && (
                          <div className="mt-4 p-3 bg-white/5 rounded-lg">
                            <p className="text-white text-sm">
                              <span className="font-medium">Class:</span>{" "}
                              {apiResponse.class_name}
                            </p>
                            <p className="text-white/70 text-xs mt-1">
                              Video generated successfully from your prompt
                            </p>
                          </div>
                        )}
                      </div>
                    ) : serverStatus === "offline" ? (
                      <div className="text-center text-white">
                        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <p className="text-lg font-medium">Server Offline</p>
                        <p className="text-sm opacity-60">
                          Please start the FastAPI backend on localhost:8000
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 text-white/40 mx-auto mb-4" />
                        <p className="text-lg font-medium">
                          No Animation Generated
                        </p>
                        <p className="text-sm opacity-60">
                          Waiting for animation generation...
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls Bar */}
                <div className="h-16 bg-black/40 border-t border-white/10 flex items-center justify-center px-4">
                  <div className="flex items-center space-x-4">
                    {/* Show retry button when we have a class name (whether video loaded or not) */}
                    {className && apiResponse ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                        disabled={isRetrying || isGenerating}
                        onClick={handleRetryVideoDownload}
                      >
                        <RefreshCw
                          className={`w-4 h-4 mr-2 ${
                            isRetrying ? "animate-spin" : ""
                          }`}
                        />
                        {isRetrying
                          ? "Retrying Video Download..."
                          : "Retry Video Download"}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white/80 hover:bg-white/10"
                        disabled={true}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Waiting for Animation...
                      </Button>
                    )}
                    <div className="text-sm text-white/60">
                      {isGenerating
                        ? `${generationStep} (${Math.round(
                            generationProgress
                          )}%)`
                        : apiResponse
                        ? `Class: ${apiResponse.class_name}`
                        : "No animation generated"}
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === "code" ? (
              <div className="h-full flex flex-col">
                {/* Code Editor */}
                <div className="flex-1 bg-[#0d1117] font-mono text-sm overflow-auto">
                  {isGenerating ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-white max-w-md">
                        <div className="w-12 h-12 border-4 border-violet-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">
                          Generating Manim Code
                        </p>
                        <p className="text-sm opacity-60 mb-6">
                          {generationStep || "Creating your animation code..."}
                        </p>

                        {/* Progress Bar for Code Tab */}
                        <div className="w-72 mx-auto">
                          <div className="flex justify-between text-xs text-white/60 mb-2">
                            <span>Code Generation</span>
                            <span>{Math.round(generationProgress)}%</span>
                          </div>
                          <Progress
                            value={generationProgress}
                            className="h-2 bg-white/10"
                          />
                          <p className="text-xs text-white/40 mt-2">
                            Generating optimized Manim code...
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <pre className="text-gray-300 leading-relaxed">
                        <code>
                          {generatedCode ||
                            "# Manim code will appear here after generation...\n# Waiting for animation generation..."}
                        </code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Code Actions */}
                <div className="h-14 bg-black/40 border-t border-white/10 flex items-center justify-between px-4">
                  <div className="text-sm text-white/60">
                    {isGenerating
                      ? `${generationStep || "Generating"} - ${Math.round(
                          generationProgress
                        )}% complete`
                      : apiResponse
                      ? `Generated code for ${apiResponse.class_name}`
                      : "Generated using Manim Community Edition"}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white/80 hover:bg-white/10"
                      onClick={() => {
                        if (generatedCode) {
                          navigator.clipboard.writeText(generatedCode);
                        }
                      }}
                      disabled={!generatedCode || isGenerating}
                    >
                      Copy Code
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={isGenerating || !generatedCode}
                      onClick={() => {
                        // Switch to preview tab to see the result
                        setActiveTab("preview");
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Result
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* Edit Interface */}
                <div className="flex-1 bg-black/20 p-6">
                  <div className="max-w-4xl mx-auto space-y-6">
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center space-x-2">
                          <Edit className="w-5 h-5" />
                          <span>Animation Editor</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Animation Title
                          </label>
                          <input
                            type="text"
                            value={animationTitle}
                            onChange={(e) => setAnimationTitle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                            placeholder="Enter animation title..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Description/Prompt
                          </label>
                          <Textarea
                            value={animationPrompt}
                            onChange={(e) => setAnimationPrompt(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 min-h-[100px]"
                            placeholder="Describe what you want to animate..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Duration (seconds)
                            </label>
                            <input
                              type="number"
                              value={duration}
                              onChange={(e) =>
                                setDuration(Number(e.target.value))
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Frame Rate (fps)
                            </label>
                            <select
                              value={frameRate}
                              onChange={(e) => setFrameRate(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                            >
                              <option value="30">30 fps</option>
                              <option value="60">60 fps</option>
                              <option value="120">120 fps</option>
                            </select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Edit Actions */}
                <div className="h-16 bg-black/40 border-t border-white/10 flex items-center justify-center px-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white/80 hover:bg-white/10"
                    >
                      Reset Changes
                    </Button>
                    <Button
                      size="sm"
                      className="bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Apply Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
