"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Play,
  BookOpen,
  Users,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import AnimationWorkspace from "@/components/animation-workspace";
import type { AnimationProject } from "@/types/animation";
import BackgroundGrid from "@/components/background-grid";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [currentProject, setCurrentProject] = useState<AnimationProject | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAnimation = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // Simulate API call to FastAPI backend
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newProject: AnimationProject = {
        id: Date.now().toString(),
        title: "Educational Animation",
        prompt: prompt,
        status: "generating",
        chunks: [],
        createdAt: new Date(),
        duration: 0,
      };

      setCurrentProject(newProject);
    } catch (error) {
      console.error("Failed to generate animation:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (currentProject) {
    return (
      <AnimationWorkspace
        project={currentProject}
        onBack={() => setCurrentProject(null)}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <AnimatedGridPattern
        numSquares={60}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Lumi
              </h1>
            </div>
            <Badge
              variant="secondary"
              className="hidden sm:flex bg-white/5 text-white/80"
            >
              AI-Powered Educational Animations
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center max-w-4xl mx-auto relative">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl animate-glow"></div>
          <div
            className="absolute -bottom-32 -right-32 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl animate-glow"
            style={{ animationDelay: "2s" }}
          ></div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transform Complex Concepts into{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Clear Visual Stories
            </span>
          </h2>
          <p className="text-xl text-white/70 mb-8 leading-relaxed">
            Lumi creates mathematically-precise educational animations that make
            learning engaging and accessible. Perfect for educators, students,
            and content creators.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-white/80">
                Educational Focus
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <Users className="w-4 h-4 text-fuchsia-400" />
              <span className="text-sm font-medium text-white/80">
                Collaborative
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white/80">
                AI-Powered
              </span>
            </div>
          </div>

          {/* Prompt Input */}
          <Card className="max-w-2xl mx-auto glass-card">
            <CardHeader>
              <CardTitle className="text-left text-white">
                Create Your Animation
              </CardTitle>
              <CardDescription className="text-left text-white/60">
                Describe the concept you want to visualize. Be specific about
                the educational goal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: Explain how photosynthesis works at the cellular level, showing the light-dependent and light-independent reactions with molecular detail..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none bg-white/5 border-white/10 focus:border-violet-500 focus:ring-violet-500 text-white placeholder:text-white/40"
              />
              <Button
                onClick={handleGenerateAnimation}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-medium py-6"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating Animation...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Animation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass-card">
            <CardHeader>
              <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-violet-400" />
              </div>
              <CardTitle className="text-white">Educational Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Designed specifically for educational content with
                mathematically-precise animations that enhance learning
                outcomes.
              </p>
              <Button
                variant="link"
                className="text-violet-400 p-0 mt-4 flex items-center"
              >
                Learn more <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <div className="w-12 h-12 bg-fuchsia-500/20 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-fuchsia-400" />
              </div>
              <CardTitle className="text-white">
                AI-Powered Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Advanced AI understands complex concepts and generates
                appropriate visual representations automatically.
              </p>
              <Button
                variant="link"
                className="text-fuchsia-400 p-0 mt-4 flex items-center"
              >
                Learn more <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-amber-400" />
              </div>
              <CardTitle className="text-white">Interactive Editing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Fine-tune your animations with our intuitive editing tools
                designed for educational content creators.
              </p>
              <Button
                variant="link"
                className="text-amber-400 p-0 mt-4 flex items-center"
              >
                Learn more <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
