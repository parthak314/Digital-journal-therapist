"use client"

import { useState, useEffect } from "react"
import { useJournal } from "@/lib/use-journal"
import { NewEntryForm } from "@/components/new-entry-form"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { SearchDialog } from "@/components/search-dialog"
import { JournalEntryComponent } from "@/components/journal-entry"
import { AITherapistPanel } from "@/components/AI_TherapistPanel"
import { JournalEntry } from "@/lib/use-journal"
import { generateAIResponse } from "@/lib/ai-feedback"

export default function Home() {
  const { entries, addEntry, deleteEntry, selectDirectory, isUsingFileSystem } = useJournal()
  const [isDirectorySelected, setIsDirectorySelected] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  useEffect(() => {
    setIsDirectorySelected(isUsingFileSystem)
  }, [isUsingFileSystem])

  const handleSelectDirectory = async () => {
    const success = await selectDirectory()
    if (success) {
      setIsDirectorySelected(true)
    } else {
      alert("Failed to select directory. Entries will be saved in browser storage.")
      setIsDirectorySelected(false)
    }
  }

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

  if (!isDirectorySelected) {
    return (
      <main className="space-y-8">
        <h1 className="text-3xl font-bold">My Personal Journal</h1>
        <p>Please select a directory to store your journal entries:</p>
        <Button onClick={handleSelectDirectory}>Select Directory</Button>
      </main>
    )
  }

  return (
    <main className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">My Personal Journal</h1>
        <SearchDialog entries={entries} onSelect={() => {}} />
      </div>
      <NewEntryForm onAddEntry={addEntry} />
      <div className="space-y-4">
        {entries.length === 0 ? (
          <p>No journal entries yet. Start writing!</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} id={`entry-${entry.id}`}>
              <JournalEntryComponent entry={entry} onDelete={deleteEntry} onSelect={handleSelectEntry} />
            </div>
          ))
        )}
      </div>
      {isPanelOpen && (
        <AITherapistPanel
          selectedEntry={selectedEntry}
          onClose={handleClosePanel}
          onGetFeedback={handleGetFeedback}
        />
      )}
    </main>
  )
}

