import { type NextRequest, NextResponse } from "next/server"

// Template configurations for different model types
const TEMPLATES = {
  text: "Elaborate the prompt for a text generation model with full context, structure, and desired tone. Always be specific and avoid ambiguity.",
  image: "Expand the prompt with rich visual cues, including style, environment, lighting, and perspective. Always be specific and avoid ambiguity.",
  video: "Enhance the prompt for a video generation AI with scene flow, camera angles, emotional tone, and pacing. Always be specific and avoid ambiguity.",
  code: "Turn this into a complete coding prompt with language, function, input/output format, constraints, and examples. Always be specific and avoid ambiguity.",
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, targetModel, isRetry } = await request.json()

    if (!prompt || !targetModel) {
      return NextResponse.json({ error: "Prompt and target model are required" }, { status: 400 })
    }

    // In a real implementation, you would use the Google Generative AI SDK here
    // For now, we'll simulate the enhancement with a more sophisticated approach
    const enhancedPrompt = await simulateEnhancement(prompt, targetModel, isRetry)

    return NextResponse.json({ enhancedPrompt })
  } catch (error) {
    console.error("Error enhancing prompt:", error)
    return NextResponse.json({ error: "Failed to enhance prompt" }, { status: 500 })
  }
}

// Simulate prompt enhancement (replace with actual Gemini API call)
async function simulateEnhancement(userPrompt: string, targetModel: string, isRetry: boolean): Promise<string> {
  // Add a small delay to simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

  const template = TEMPLATES[targetModel as keyof typeof TEMPLATES] || TEMPLATES.text

  // Create different variations for retry attempts
  const retryVariations = ["Alternative approach: ", "Enhanced version: ", "Refined take: ", "Improved iteration: "]

  const prefix = isRetry ? retryVariations[Math.floor(Math.random() * retryVariations.length)] : ""

  // Simulate different enhancement patterns based on model type
  switch (targetModel) {
    case "text":
      return `${prefix}Create a compelling ${userPrompt.toLowerCase()} with the following specifications:

**Context & Setting:**
- Establish clear background information and setting
- Define the target audience and appropriate tone
- Include relevant cultural or temporal context

**Structure & Flow:**
- Begin with an engaging hook or introduction
- Develop ideas with logical progression
- Include specific examples and vivid details
- Conclude with a satisfying resolution or call-to-action

**Style Guidelines:**
- Use active voice and varied sentence structure
- Incorporate sensory details and emotional resonance
- Maintain consistency in perspective and tense
- Balance description with dialogue or action as appropriate

**Quality Markers:**
- Ensure originality and creativity
- Include specific, concrete details rather than generalizations
- Create memorable characters or concepts if applicable
- Aim for approximately 500-1000 words unless specified otherwise`

    case "image":
      return `${prefix}Generate a visually stunning image of ${userPrompt} with these detailed specifications:

**Visual Composition:**
- Main subject: ${userPrompt} positioned using rule of thirds
- Background: Complementary environment that enhances the subject
- Foreground elements: Add depth and visual interest
- Color palette: Harmonious colors that evoke the desired mood

**Technical Details:**
- Lighting: Dramatic lighting with clear light source (golden hour, studio lighting, or natural daylight)
- Camera angle: Eye-level perspective with slight depth of field
- Resolution: High-resolution, crisp details throughout
- Style: Photorealistic with professional photography quality

**Artistic Elements:**
- Mood: [Specify emotional tone - serene, energetic, mysterious, etc.]
- Texture: Rich textures that add tactile quality
- Contrast: Balanced highlights and shadows for visual impact
- Focus: Sharp focus on main subject with subtle background blur

**Additional Specifications:**
- Avoid: Blurry images, distorted proportions, unrealistic elements
- Include: Professional composition, natural poses, authentic expressions
- Format: Landscape orientation, suitable for high-quality printing`

    case "video":
      return `${prefix}Create a dynamic video sequence featuring ${userPrompt} with comprehensive production details:

**Scene Structure:**
- Opening: Establish setting and context (0-5 seconds)
- Development: Build narrative tension and visual interest (5-25 seconds)
- Climax: Peak moment of action or emotion (25-30 seconds)
- Resolution: Satisfying conclusion or transition (30-35 seconds)

**Cinematography:**
- Camera movements: Smooth transitions between wide, medium, and close-up shots
- Angles: Varied perspectives including establishing shots and intimate details
- Pacing: Rhythm that matches the content's emotional arc
- Transitions: Seamless cuts and natural flow between scenes

**Visual Elements:**
- Color grading: Cinematic color palette that enhances mood
- Lighting: Professional lighting setup with motivated light sources
- Composition: Visually appealing framing with leading lines and depth
- Motion: Natural, purposeful movement that serves the narrative

**Audio Considerations:**
- Ambient sound: Appropriate background audio that enhances immersion
- Music: Complementary soundtrack that supports emotional tone
- Sound effects: Realistic audio elements that add authenticity
- Dialogue: Clear, natural speech if applicable

**Technical Specifications:**
- Duration: 30-60 seconds optimal length
- Quality: 4K resolution with smooth 24-30fps playback
- Format: Standard aspect ratio suitable for multiple platforms`

    case "code":
      return `${prefix}Develop a comprehensive coding solution for ${userPrompt} with complete implementation details:

**Project Requirements:**
- Primary function: ${userPrompt}
- Programming language: [Specify preferred language - Python, JavaScript, Java, etc.]
- Framework/Libraries: Include relevant dependencies and imports
- Target platform: Web, mobile, desktop, or command-line application

**Implementation Structure:**
\`\`\`
// Main function or class definition
// Input parameters with type annotations
// Core logic implementation
// Error handling and edge cases
// Return values with proper formatting
\`\`\`

**Code Specifications:**
- Follow language-specific best practices and conventions
- Include comprehensive error handling and input validation
- Add detailed comments explaining complex logic
- Implement proper logging and debugging capabilities
- Ensure code is modular and reusable

**Input/Output Format:**
- Input: Clearly defined parameters with examples
- Processing: Step-by-step algorithm explanation
- Output: Expected return format with sample results
- Edge cases: Handle invalid inputs and boundary conditions

**Testing & Documentation:**
- Include unit tests for core functionality
- Provide usage examples and sample data
- Document API endpoints or function signatures
- Add performance considerations and optimization notes

**Additional Features:**
- Configuration options for customization
- Integration capabilities with other systems
- Scalability considerations for larger datasets
- Security measures for data protection`

    default:
      return `${prefix}Enhanced version of your prompt: ${userPrompt}

This enhanced prompt provides more context, specific requirements, and clear expectations for better AI-generated results. The enhancement includes detailed specifications, quality guidelines, and structured formatting to ensure optimal output quality.`
  }
}
