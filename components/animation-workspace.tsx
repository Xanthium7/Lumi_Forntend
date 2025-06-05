"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Play, Pause, Download, Layers, Clock } from "lucide-react"
import type { AnimationProject, AnimationChunk } from "@/types/animation"
import ChunkViewer from "@/components/chunk-viewer"
import VideoEditor from "@/components/video-editor"
import BackgroundGrid from "@/components/background-grid"

interface AnimationWorkspaceProps {
  project: AnimationProject
  onBack: () => void
}

export default function AnimationWorkspace({ project, onBack }: AnimationWorkspaceProps) {
  const [currentProject, setCurrentProject] = useState<AnimationProject>(project)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate chunk generation
    const generateChunks = async () => {
      const chunks: AnimationChunk[] = []

      for (let i = 0; i < 4; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const newChunk: AnimationChunk = {
          id: `chunk-${i}`,
          title: `Animation Segment ${i + 1}`,
          description: `Generated segment explaining part ${i + 1} of the concept`,
          duration: 3 + Math.random() * 2,
          status: "completed",
          thumbnailUrl: `/placeholder.svg?height=120&width=200`,
          videoUrl: `/placeholder.svg?height=400&width=600`,
          createdAt: new Date(),
        }

        chunks.push(newChunk)
        setCurrentProject((prev) => ({
          ...prev,
          chunks: [...chunks],
          status: i === 3 ? "completed" : "generating",
        }))
        setProgress(((i + 1) / 4) * 100)
      }
    }

    if (currentProject.status === "generating") {
      generateChunks()
    }
  }, [currentProject.status])

  const totalDuration = currentProject.chunks.reduce((sum, chunk) => sum + chunk.duration, 0)

  return (
    <div className="min-h-screen">
      <BackgroundGrid />

      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="text-white/80 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-white">{currentProject.title}</h1>
                <p className="text-sm text-white/60 truncate max-w-md">{currentProject.prompt}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                variant={currentProject.status === "completed" ? "default" : "secondary"}
                className="bg-white/10 text-white"
              >
                {currentProject.status === "generating" ? "Generating" : "Ready"}
              </Badge>
              {currentProject.status === "completed" && (
                <Button size="sm" className="bg-white/10 text-white hover:bg-white/20">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {currentProject.status === "generating" ? (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                <span>Generating Your Animation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-white/60">
                Creating {4 - currentProject.chunks.length} remaining animation segments...
              </p>
              {currentProject.chunks.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  {currentProject.chunks.map((chunk) => (
                    <ChunkViewer key={chunk.id} chunk={chunk} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="preview" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="preview" className="data-[state=active]:bg-white/10 text-white">
                  Preview
                </TabsTrigger>
                <TabsTrigger value="chunks" className="data-[state=active]:bg-white/10 text-white">
                  Chunks
                </TabsTrigger>
                <TabsTrigger value="edit" className="data-[state=active]:bg-white/10 text-white">
                  Edit
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-4 text-sm text-white/60">
                <div className="flex items-center space-x-1">
                  <Layers className="w-4 h-4" />
                  <span>{currentProject.chunks.length} segments</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{totalDuration.toFixed(1)}s total</span>
                </div>
              </div>
            </div>

            <TabsContent value="preview" className="space-y-6">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="aspect-video bg-black/60 rounded-lg flex items-center justify-center mb-4 border border-white/10">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-60" />
                      <p className="text-lg font-medium">Animation Preview</p>
                      <p className="text-sm opacity-60">Click play to preview your animation</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant={isPlaying ? "secondary" : "default"}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={
                        isPlaying
                          ? "bg-white/10 text-white hover:bg-white/20"
                          : "bg-gradient-to-r from-violet-600 to-fuchsia-600"
                      }
                    >
                      {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chunks" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProject.chunks.map((chunk) => (
                  <ChunkViewer key={chunk.id} chunk={chunk} detailed />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="edit" className="space-y-6">
              <VideoEditor project={currentProject} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
