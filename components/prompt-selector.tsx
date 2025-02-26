import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sparkles, Loader2 } from "lucide-react"
import { JournalPrompt, fetchPrompts, generateAIPrompt } from "@/lib/journal-prompts"

interface PromptSelectorProps {
  onSelectPrompt: (prompt: JournalPrompt) => void
}

export function PromptSelector({ onSelectPrompt }: PromptSelectorProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const categories = ['reflection', 'gratitude', 'growth', 'goals', 'creativity'];

  const handleQuotePrompt = async () => {
    setIsLoading(true);
    try {
      const prompts = await fetchPrompts();
      onSelectPrompt(prompts[0]);
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIPrompt = async (category: string) => {
    setIsLoading(true);
    try {
      const prompt = await generateAIPrompt(category);
      onSelectPrompt(prompt);
    } catch (error) {
      console.error('Error generating AI prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px]" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Get Writing Prompt
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={handleQuotePrompt}>
          Reflect on a Quote
        </DropdownMenuItem>
        {categories.map((category) => (
          <DropdownMenuItem
            key={category}
            onClick={() => handleAIPrompt(category)}
          >
            AI {category.charAt(0).toUpperCase() + category.slice(1)} Prompt
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 