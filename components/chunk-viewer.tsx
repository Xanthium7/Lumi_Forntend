"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Edit3 } from "lucide-react"
import type { AnimationChunk } from "@/types/animation"

interface ChunkViewerProps {
  chunk: AnimationChunk
  detailed?: boolean
}

export default function ChunkViewer({ chunk, detailed = false }: ChunkViewerProps) {
  return (
    <Card className={`overflow-hidden glass-card ${detailed ? "h-auto" : "h-fit"}`}>
      <div className="aspect-video bg-black/60 relative border-b border-white/10">
        <img
          src={chunk.thumbnailUrl || "/placeholder.svg"}
          alt={chunk.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Button size="sm" variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
            <Play className="w-4 h-4" />
          </Button>
        </div>
        <Badge className="absolute top-2 right-2 text-xs bg-black/60 text-white border border-white/20">
          {chunk.duration.toFixed(1)}s
        </Badge>
      </div>

      {detailed ? (
        <>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">{chunk.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-white/70 mb-4">{chunk.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs text-white/50">
                <Clock className="w-3 h-3" />
                <span>{chunk.duration.toFixed(1)}s</span>
              </div>
              <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/10">
                <Edit3 className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
          </CardContent>
        </>
      ) : (
        <CardContent className="p-3">
          <h4 className="font-medium text-sm truncate text-white">{chunk.title}</h4>
          <div className="flex items-center space-x-1 text-xs text-white/50 mt-1">
            <Clock className="w-3 h-3" />
            <span>{chunk.duration.toFixed(1)}s</span>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
