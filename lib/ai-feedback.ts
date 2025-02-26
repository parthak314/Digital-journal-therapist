import { generateLlamaResponse } from "./llama-client"

export async function generateAIResponse(content: string): Promise<string> {
  const prompt = `Provide feedback on the following journal entry:\n\n${content}`
  const response = await generateLlamaResponse(prompt)
  return response
} 