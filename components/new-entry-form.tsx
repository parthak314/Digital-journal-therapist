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
  const editorRef = React.useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const plainText = editorRef.current?.innerText || ""
    if (plainText.trim()) {
      // Save HTML content for formatting
      onAddEntry(title.trim() || "Untitled Entry", editorRef.current?.innerHTML || "")
      setTitle("")
      setContent("")
      if (editorRef.current) editorRef.current.innerHTML = ""
    }
  }

  const handlePromptSelect = (prompt: JournalPrompt) => {
    if (editorRef.current) {
      editorRef.current.innerHTML += `<div>${prompt.question}</div>`
    }
  }

  // Keyboard shortcuts for formatting
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey && e.key.toLowerCase() === "b") {
      e.preventDefault()
      document.execCommand("bold")
    }
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
      e.preventDefault()
      document.execCommand("underline")
    }
    if (e.ctrlKey && e.shiftKey && (e.key === "+" || e.key === "=")) {
      e.preventDefault()
      document.execCommand("fontSize", false, "5") // 5 is large
    }
    if (e.ctrlKey && e.shiftKey && e.key === "_") {
      e.preventDefault()
      document.execCommand("fontSize", false, "2") // 2 is small
    }
  }

  const handleDownload = () => {
    if (!editorRef.current || !editorRef.current.innerText.trim()) return
    const timestamp = new Date().toLocaleString()
    const fileContent = `${title || "Untitled Entry"}\n${timestamp}\n\n${editorRef.current.innerText}`
    const blob = new Blob([fileContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    const safeTitle = (title || "journal-entry").toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const filename = `${safeTitle}-${new Date().toISOString().split('T')[0]}.txt`
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleVoiceInput = (transcript: string) => {
    if (editorRef.current) {
      editorRef.current.innerText += " " + transcript
      editorRef.current.focus()
    }
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
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[200px] pr-12 border rounded-md p-3 focus:outline-none"
          onKeyDown={handleKeyDown}
          style={{ whiteSpace: "pre-wrap" }}
          aria-label="Journal entry editor"
          data-placeholder="Write your journal entry here..."
        />
        {/* Placeholder styling */}
        <style jsx>{`
          [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #a0aec0;
            pointer-events: none;
            display: block;
          }
        `}</style>
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
          disabled={!editorRef.current || !editorRef.current.innerText.trim()}
        >
          <Download className="mr-2 h-4 w-4" />
          Download as Text
        </Button>
      </div>
    </form>
  )
}

