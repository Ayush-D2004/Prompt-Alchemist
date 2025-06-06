"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Sparkles, Wand2, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const TEMPLATES = {
  text: "Elaborate the prompt for a text generation model with full context, structure, and desired tone.",
  image: "Expand the prompt with rich visual cues, including style, environment, lighting, and perspective.",
  video: "Enhance the prompt for a video generation AI with scene flow, camera angles, emotional tone, and pacing.",
  code: "Turn this into a complete coding prompt with language, function, input/output format, constraints, and examples.",
}

export default function PromptEnhancer() {
  const [userInput, setUserInput] = useState("")
  const [targetType, setTargetType] = useState("text")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null)
  const [copied, setCopied] = useState(false)

  const enhancePrompt = async (includeRetry = false) => {
    if (!userInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a prompt to enhance.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setFeedback(null)

    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userInput,
          targetModel: targetType,
          isRetry: includeRetry,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to enhance prompt")
      }

      const data = await response.json()
      setEnhancedPrompt(data.enhancedPrompt)

      toast({
        title: "Prompt Enhanced!",
        description: "Your prompt has been successfully enhanced.",
      })
    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: "There was an error enhancing your prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!enhancedPrompt) return

    try {
      await navigator.clipboard.writeText(enhancedPrompt)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Enhanced prompt copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleFeedback = (type: "like" | "dislike") => {
    setFeedback(type)
    toast({
      title: type === "like" ? "Thanks for the feedback!" : "Feedback Received",
      description:
        type === "like"
          ? "Glad you found the enhanced prompt helpful!"
          : "We'll use your feedback to improve future enhancements.",
    })
  }

  const handleRetry = () => {
    enhancePrompt(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wand2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Prompt Alchemist
            </h1>
            <ThemeToggle />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your simple prompts into detailed, professional instructions that get better AI results
          </p>
        </div>

        {/* Input Section */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Enter Your Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Textarea
                placeholder="e.g., write a bedtime story for children"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="min-h-[120px] resize-none border-2 focus:border-indigo-500 dark:focus:border-indigo-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Model Type</label>
              <Select value={targetType} onValueChange={setTargetType}>
                <SelectTrigger className="border-2 focus:border-indigo-500 dark:focus:border-indigo-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Text</Badge>
                      <span>Text Generation</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="image">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Image</Badge>
                      <span>Image Generation</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Video</Badge>
                      <span>Video Generation</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="code">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Code</Badge>
                      <span>Code Generation</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => enhancePrompt(false)}
              disabled={isLoading}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Enhance Prompt
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        {enhancedPrompt && (
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Enhanced Prompt
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex items-center gap-2">
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    Retry
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-500">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{enhancedPrompt}</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Was this helpful?</span>
                  <div className="flex gap-1">
                    <Button
                      variant={feedback === "like" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFeedback("like")}
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {feedback === "like" && "Thanks!"}
                    </Button>
                    <Button
                      variant={feedback === "dislike" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFeedback("dislike")}
                      className="flex items-center gap-1"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      {feedback === "dislike" && "Noted"}
                    </Button>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Enhanced for {targetType} generation
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Built with ❤️ by Ayush | Powered by Gemini AI</p>
        </div>
      </div>
    </div>
  )
}
