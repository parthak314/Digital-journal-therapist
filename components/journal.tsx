import * as React from "react"
import { JournalEntryComponent } from "./journal-entry"
import { AITherapistPanel } from "./AI_TherapistPanel"
import { JournalEntry } from "@/lib/use-journal"
import { generateAIResponse } from "@/lib/ai-feedback"

export function Journal() {
  const [entries, setEntries] = React.useState<JournalEntry[]>([])
  const [selectedEntry, setSelectedEntry] = React.useState<JournalEntry | null>(null)
  const [isPanelOpen, setIsPanelOpen] = React.useState(false)

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setSelectedEntry(null)
  }

  const handleGetFeedback = async (content: string) => {
    const feedback = await generateAIResponse(content)
    return feedback
  }

  return (
    <div className="flex">
      <div className="flex-1">
        {entries.map(entry => (
          <JournalEntryComponent
            key={entry.id}
            entry={entry}
            onDelete={(id) => {/* delete logic */}}
            onSelect={handleSelectEntry}
          />
        ))}
      </div>
      {isPanelOpen && (
        <AITherapistPanel
          selectedEntry={selectedEntry}
          onClose={handleClosePanel}
          onGetFeedback={handleGetFeedback}
        />
      )}
    </div>
  )
} 