export interface JournalPrompt {
  id: string;
  question: string;
  category: 'reflection' | 'gratitude' | 'growth' | 'goals' | 'creativity';
}

// Function to fetch prompts from an API
export async function fetchPrompts(): Promise<JournalPrompt[]> {
  try {
    // You can replace this URL with any prompts API
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    
    // Transform the quote into a journal prompt
    return [{
      id: data._id,
      question: `Reflect on this quote: "${data.content}" - ${data.author}. How does it relate to your life?`,
      category: 'reflection'
    }];
  } catch (error) {
    console.error('Error fetching prompts:', error);
    // Fallback prompt if API fails
    return [{
      id: 'fallback',
      question: "What's on your mind today?",
      category: 'reflection'
    }];
  }
}

// Function to generate AI-powered prompts using OpenAI
export async function generateAIPrompt(category: string): Promise<JournalPrompt> {
  try {
    const response = await fetch('/api/generate-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error generating AI prompt:', error);
    return {
      id: 'ai-fallback',
      question: "What would you like to explore today?",
      category: 'reflection'
    };
  }
}

export const journalPrompts: JournalPrompt[] = [
  // Reflection
  {
    id: 'proud',
    question: "What are you most proud of today?",
    category: 'reflection'
  },
  {
    id: 'learned',
    question: "What's something new you learned recently?",
    category: 'reflection'
  },
  {
    id: 'challenge',
    question: "What challenge did you overcome this week?",
    category: 'reflection'
  },

  // Gratitude
  {
    id: 'grateful',
    question: "List three things you're grateful for today.",
    category: 'gratitude'
  },
  {
    id: 'person',
    question: "Who made a positive impact on your life recently and why?",
    category: 'gratitude'
  },
  {
    id: 'simple',
    question: "What simple pleasure brought you joy today?",
    category: 'gratitude'
  },

  // Personal Growth
  {
    id: 'improve',
    question: "What's one thing you'd like to improve about yourself?",
    category: 'growth'
  },
  {
    id: 'boundary',
    question: "Have you set any new boundaries recently? How did it feel?",
    category: 'growth'
  },
  {
    id: 'comfort',
    question: "What took you out of your comfort zone recently?",
    category: 'growth'
  },

  // Goals
  {
    id: 'achievement',
    question: "What's one small win you had today?",
    category: 'goals'
  },
  {
    id: 'next-step',
    question: "What's the next step towards your biggest goal?",
    category: 'goals'
  },
  {
    id: 'future',
    question: "Where do you see yourself in 6 months? What can you do today to get there?",
    category: 'goals'
  },

  // Creativity
  {
    id: 'create',
    question: "What did you create or express recently?",
    category: 'creativity'
  },
  {
    id: 'inspire',
    question: "What's inspiring you lately?",
    category: 'creativity'
  },
  {
    id: 'dream',
    question: "If you had unlimited resources, what would you create?",
    category: 'creativity'
  }
]; 