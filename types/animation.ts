export interface AnimationChunk {
  id: string
  title: string
  description: string
  duration: number
  status: "generating" | "completed" | "error"
  thumbnailUrl: string
  videoUrl: string
  createdAt: Date
}

export interface AnimationProject {
  id: string
  title: string
  prompt: string
  status: "generating" | "completed" | "error"
  chunks: AnimationChunk[]
  createdAt: Date
  duration: number
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

export interface GenerationProgress {
  currentStep: number
  totalSteps: number
  message: string
}
