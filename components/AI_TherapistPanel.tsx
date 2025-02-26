import * as React from "react"
import { Button } from "@/components/ui/button"
import { JournalEntry } from "@/lib/use-journal"

interface AITherapistPanelProps {
  selectedEntry: JournalEntry | null
  onClose: () => void
  onGetFeedback: (content: string) => Promise<string>
}

export function AITherapistPanel({ selectedEntry, onClose, onGetFeedback }: AITherapistPanelProps) {
  const [feedback, setFeedback] = React.useState<string>("")
  const [loading, setLoading] = React.useState<boolean>(false)

  const handleGetFeedback = async () => {
    if (selectedEntry) {
      setLoading(true)
      const response = await onGetFeedback(selectedEntry.content)
      setFeedback(response)
      setLoading(false)
    }
  }

  return (
    <div className="fixed right-0 top-0 w-1/3 h-full bg-white shadow-lg p-4">
      <h2 className="text-lg font-bold">AI Therapist Feedback</h2>
      <Button variant="outline" onClick={onClose} className="mb-4">Close</Button>
      {selectedEntry ? (
        <>
          <h3 className="font-semibold">{selectedEntry.title}</h3>
          <p className="whitespace-pre-wrap">{selectedEntry.content}</p>
          <Button onClick={handleGetFeedback} disabled={loading} className="mt-4">
            {loading ? "Loading..." : "Get Feedback"}
          </Button>
          {feedback && (
            <div className="mt-4">
              <h4 className="font-semibold">Feedback:</h4>
              <p>{feedback}</p>
            </div>
          )}
        </>
      ) : (
        <p>Select an article to see feedback.</p>
      )}
    </div>
  )
} 