"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Scissors, Volume2, Palette, Type, Layers, RotateCcw, Save } from "lucide-react"
import type { AnimationProject } from "@/types/animation"

interface VideoEditorProps {
  project: AnimationProject
}

export default function VideoEditor({ project }: VideoEditorProps) {
  const [selectedChunk, setSelectedChunk] = useState<string | null>(null)
  const [volume, setVolume] = useState([80])
  const [brightness, setBrightness] = useState([100])
  const [contrast, setContrast] = useState([100])

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Layers className="w-5 h-5" />
            <span>Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {project.chunks.map((chunk, index) => (
                <div
                  key={chunk.id}
                  className={`flex-shrink-0 w-32 h-20 rounded border-2 cursor-pointer transition-colors ${
                    selectedChunk === chunk.id
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                  onClick={() => setSelectedChunk(chunk.id)}
                >
                  <img
                    src={chunk.thumbnailUrl || "/placeholder.svg"}
                    alt={chunk.title}
                    className="w-full h-full object-cover rounded opacity-80"
                  />
                  <div className="absolute bottom-1 left-1">
                    <Badge variant="secondary" className="text-xs bg-black/60 text-white border border-white/20">
                      {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/10">
                <Scissors className="w-4 h-4 mr-2" />
                Split
              </Button>
              <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/10">
                <RotateCcw className="w-4 h-4 mr-2" />
                Undo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editing Tools */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <CardTitle className="text-white">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-black/60 rounded-lg flex items-center justify-center border border-white/10">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <Layers className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium">Video Editor</p>
                <p className="text-sm opacity-60">
                  {selectedChunk ? "Editing selected chunk" : "Select a chunk to edit"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="audio" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
                <TabsTrigger value="audio" className="data-[state=active]:bg-white/10 text-white">
                  <Volume2 className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="visual" className="data-[state=active]:bg-white/10 text-white">
                  <Palette className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="text" className="data-[state=active]:bg-white/10 text-white">
                  <Type className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="audio" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Volume</label>
                  <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-full" />
                  <div className="text-xs text-white/50 mt-1">{volume[0]}%</div>
                </div>
              </TabsContent>

              <TabsContent value="visual" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Brightness</label>
                  <Slider value={brightness} onValueChange={setBrightness} max={200} step={1} className="w-full" />
                  <div className="text-xs text-white/50 mt-1">{brightness[0]}%</div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Contrast</label>
                  <Slider value={contrast} onValueChange={setContrast} max={200} step={1} className="w-full" />
                  <div className="text-xs text-white/50 mt-1">{contrast[0]}%</div>
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4 mt-4">
                <Button size="sm" className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600">
                  Add Text Overlay
                </Button>
                <Button size="sm" variant="outline" className="w-full border-white/10 text-white hover:bg-white/10">
                  Add Captions
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Save Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
          Cancel
        </Button>
        <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
