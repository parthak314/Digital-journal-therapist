import { NextRequest, NextResponse } from 'next/server';
import { semanticSearch } from '@/lib/llama-client';
import { JournalEntry } from '@/lib/use-journal';

export async function POST(req: NextRequest) {
  try {
    const { query, entries } = await req.json();
    
    if (!query || !entries) {
      return NextResponse.json({ error: 'Missing query or entries' }, { status: 400 });
    }

    const results = await semanticSearch(query, entries);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in semantic search route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 