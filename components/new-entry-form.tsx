"use client"

import * as React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PromptSelector } from "./prompt-selector"
import { JournalPrompt } from "@/lib/journal-prompts"
import { Download } from "lucide-react"
import { VoiceInputButton } from "./voice-input-button"

interface NewEntryFormProps {
  onAddEntry: (title: string, content: string) => void
}

export function NewEntryForm({ onAddEntry }: NewEntryFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onAddEntry(title.trim() || "Untitled Entry", content)
      setTitle("")
      setContent("")
    }
  }

  const handlePromptSelect = (prompt: JournalPrompt) => {
    setContent(prevContent => 
      prevContent ? `${prevContent}\n\n${prompt.question}\n` : `${prompt.question}\n`
    )
  }

  const handleDownload = () => {
    if (!content.trim()) return;

    // Create the content with title and timestamp
    const timestamp = new Date().toLocaleString()
    const fileContent = `${title || "Untitled Entry"}\n${timestamp}\n\n${content}`
    
    // Create blob and download link
    const blob = new Blob([fileContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    // Set filename using title or timestamp
    const safeTitle = (title || "journal-entry").toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const filename = `${safeTitle}-${new Date().toISOString().split('T')[0]}.txt`
    
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleVoiceInput = (transcript: string) => {
    setContent(prevContent => {
      const newContent = prevContent 
        ? `${prevContent} ${transcript}`
        : transcript;
      
      // Focus and scroll to end of textarea
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight
      }
      
      return newContent
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Entry title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium"
        />
        <PromptSelector onSelectPrompt={handlePromptSelect} />
      </div>
      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder="Write your journal entry here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] pr-12"
        />
        <div className="absolute right-2 top-2">
          <VoiceInputButton onTranscript={handleVoiceInput} />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button type="submit">Add Entry</Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleDownload}
          disabled={!content.trim()}
        >
          <Download className="mr-2 h-4 w-4" />
          Download as Text
        </Button>
      </div>
    </form>
  )
}

