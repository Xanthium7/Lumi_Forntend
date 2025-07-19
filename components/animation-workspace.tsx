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
} from "lucide-react";
import type { AnimationProject, AnimationChunk } from "@/types/animation";

import useWebContainer from "@/hooks/useWebcontainer";
import { WebContainer } from "@webcontainer/api";

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
        "Hi! I'm ready to help you create your educational animation. What would you like to visualize?",
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
        "Great! I'm generating a detailed animation showing photosynthesis at the molecular level. This will include chloroplast structure, light reactions, and the Calvin cycle.",
      timestamp: new Date(Date.now() - 120000),
    },
  ]);

  useEffect(() => {
    // Simulate code generation
    const generateCode = async () => {
      setIsGenerating(true);

      setGeneratedCode("some cool code");

      setIsGenerating(false);
    };

    generateCode();
  }, []);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "I understand your request. Let me help you modify the animation accordingly.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
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
          <Button size="sm" className="bg-white text-black hover:bg-white/90">
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
                        <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-lg font-medium">
                          Generating Animation
                        </p>
                        <p className="text-sm opacity-60">
                          Creating your educational visualization...
                        </p>
                        <div className="mt-4 w-64 mx-auto">
                          <Progress value={progress} className="h-2" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <Play className="w-20 h-20 mx-auto mb-4 opacity-60" />
                        <p className="text-xl font-medium mb-2">
                          Animation Ready
                        </p>
                        <p className="text-sm opacity-60 mb-6">
                          Your educational animation has been generated
                        </p>
                        <Button
                          size="lg"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 mr-2" />
                          ) : (
                            <Play className="w-5 h-5 mr-2" />
                          )}
                          {isPlaying ? "Pause" : "Play Animation"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls Bar */}
                <div className="h-16 bg-black/40 border-t border-white/10 flex items-center justify-center px-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white/80 hover:bg-white/10"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                    <div className="text-sm text-white/60">
                      Duration: 30s • Resolution: 1920x1080 • 60fps
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === "code" ? (
              <div className="h-full flex flex-col">
                {/* Code Editor */}
                <div className="flex-1 bg-[#0d1117] font-mono text-sm overflow-auto">
                  <div className="p-4">
                    <pre className="text-gray-300 leading-relaxed">
                      <code>
                        {generatedCode ||
                          "// Code will appear here as it's generated..."}
                      </code>
                    </pre>
                    {isGenerating && (
                      <div className="inline-block w-2 h-5 bg-violet-400 animate-pulse ml-1" />
                    )}
                  </div>
                </div>

                {/* Code Actions */}
                <div className="h-14 bg-black/40 border-t border-white/10 flex items-center justify-between px-4">
                  <div className="text-sm text-white/60">
                    Generated using Manim Community Edition
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white/80 hover:bg-white/10"
                    >
                      Copy Code
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Run Code
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
