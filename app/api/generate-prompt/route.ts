import { NextRequest, NextResponse } from 'next/server';
import { generateLlamaResponse } from '@/lib/llama-client';

export async function POST(req: NextRequest) {
  try {
    const { category } = await req.json();
    
    const promptRequest = `Generate a single, thoughtful journaling prompt for the category: ${category}. The prompt should encourage deep reflection and personal insight.`;
    
    const promptResponse = await generateLlamaResponse(promptRequest);
    
    return NextResponse.json({
      id: Date.now().toString(),
      question: promptResponse,
      category: category,
    });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate prompt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 