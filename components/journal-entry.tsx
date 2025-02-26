import { JournalEntry } from "@/lib/use-journal"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface JournalEntryProps {
  entry: JournalEntry
  onDelete: (id: string) => void
  onSelect: (entry: JournalEntry) => void
}

export function JournalEntryComponent({ entry, onDelete, onSelect }: JournalEntryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Function to get the snippet of the first 5 lines
  const getSnippet = (content: string) => {
    const lines = content.split('\n').slice(0, 5); // Get the first 5 lines
    return lines.join('\n') + (lines.length === 5 ? '...' : ''); // Add ellipsis if there are more lines
  }

  // State to manage full view
  const [isFullView, setIsFullView] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entry.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatDate(entry.date)}
        </p>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">
          {isFullView ? entry.content : getSnippet(entry.content)}
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(entry.id)}
        >
          Delete
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onSelect(entry);
          }}
        >
          Provide Feedback
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFullView(!isFullView)}
        >
          {isFullView ? "Show Less" : "View Full Entry"}
        </Button>
      </CardFooter>
    </Card>
  )
}

