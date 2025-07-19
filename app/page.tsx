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
import Image from "next/image";

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
        className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] opacity-50 inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src="/lumi.png"
                alt="Lumi Logo"
                width={100}
                height={40}
                className="h-10 w-20 cursor-pointer hover:animate-brightness-flicker transition-all duration-300"
                style={{
                  filter:
                    "brightness(1.3) contrast(1.1) drop-shadow(0 0 4px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 8px rgba(139, 92, 246, 0.4)) drop-shadow(0 0 12px rgba(139, 92, 246, 0.2))",
                }}
              />
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

          <h2 className="text-4xl md:text-6xl font-medium text-white mb-6 leading-tight">
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
                Mathematical Precision
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

      {/* Video Comparison Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-medium text-white mb-4">
            See the{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Difference
            </span>
          </h3>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Compare educational animations generated by state-of-the-art video
            models versus our specialized educational AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Google Veo 3 Video */}
          <div className="space-y-6">
            <div className="text-center">
              <Badge className="bg-white/10 text-white/80 border-white/20 mb-4">
                State-of-the-art Video Model
              </Badge>
              <h4 className="text-xl font-medium text-white mb-2">
                Google Veo 3
              </h4>
              <p className="text-white/60 text-sm">
                Veo 3 struggles to generate consistent longer videos across
                multiple clips.
              </p>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/veo3.mp4" type="video/mp4" />
                {/* Placeholder for demo */}
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-white/40 mx-auto mb-2" />
                    <p className="text-white/40">Veo 3 Sample</p>
                  </div>
                </div>
              </video>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center text-white/60">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                Generic visual representation
              </div>
              <div className="flex items-center text-white/60">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                Limited educational context
              </div>
              <div className="flex items-center text-white/60">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                Inconsistency among the video clips
              </div>
            </div>
          </div>

          {/* Lumi Video */}
          <div className="space-y-6">
            <div className="text-center">
              <Badge className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-300 border-violet-500/30 mb-4">
                Our Implemented Solution
              </Badge>
              <h4 className="text-xl font-medium text-white mb-2">Lumi AI</h4>
              <p className="text-white/60 text-sm">
                Purpose-built for education
              </p>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-sm border border-violet-500/20">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/lumi.mp4" type="video/mp4" />
                {/* Placeholder for demo */}
                <div className="w-full h-full bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white/60">Lumi Sample</p>
                  </div>
                </div>
              </video>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center text-white/80">
                <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full mr-3"></div>
                Educationally-focused content
              </div>
              <div className="flex items-center text-white/80">
                <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full mr-3"></div>
                Mathematically precise animations
              </div>
              <div className="flex items-center text-white/80">
                <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full mr-3"></div>
                Enhanced visualization and learning outcomes
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-white/60 mb-6">
            Experience the difference specialized educational AI makes
          </p>
          <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-8 py-3">
            Try Lumi Now
          </Button>
        </div>
      </section>
    </div>
  );
}
