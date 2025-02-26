"use client"

import { useState, useEffect } from "react"

export interface JournalEntry {
  id: string
  title: string
  content: string
  date: string
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null)

  useEffect(() => {
    loadEntries()
  }, [directoryHandle])

  const loadEntries = async () => {
    if (directoryHandle) {
      const loadedEntries: JournalEntry[] = []
      for await (const [name, fileHandle] of directoryHandle.entries()) {
        if (name.endsWith(".json")) {
          try {
            const file = await fileHandle.getFile()
            const content = await file.text()
            const entry = JSON.parse(content)
            if (!entry.date) entry.date = new Date().toISOString()
            if (!entry.title) entry.title = 'Untitled Entry'
            loadedEntries.push(entry)
          } catch (error) {
            console.error(`Error loading entry ${name}:`, error)
          }
        }
      }
      loadedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setEntries(loadedEntries)
    } else {
      const storedEntries = localStorage.getItem("journalEntries")
      if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries)
        const updatedEntries = parsedEntries.map((entry: JournalEntry) => ({
          ...entry,
          date: entry.date || new Date().toISOString(),
          title: entry.title || 'Untitled Entry'
        }))
        setEntries(updatedEntries)
      }
    }
  }

  const selectDirectory = async () => {
    if ("showDirectoryPicker" in window) {
      try {
        const handle = await window.showDirectoryPicker({
          mode: "readwrite",
          startIn: "documents",
        })
        setDirectoryHandle(handle)
        await loadEntries()
        return true
      } catch (error) {
        console.error("Error selecting directory:", error)
        return false
      }
    } else {
      // Fallback for browsers that do not support showDirectoryPicker
      const input = document.createElement("input")
      input.type = "file"
      input.webkitdirectory = true
      input.multiple = true

      input.onchange = async (event) => {
        const files = (event.target as HTMLInputElement).files
        if (files) {
          const loadedEntries: JournalEntry[] = []
          for (const file of files) {
            if (file.name.endsWith(".json")) {
              const content = await file.text()
              loadedEntries.push(JSON.parse(content))
            }
          }
          setEntries(loadedEntries)
          localStorage.setItem("journalEntries", JSON.stringify(loadedEntries))
        }
      }

      input.click()
      return false
    }
  }

  const addEntry = async (title: string, content: string) => {
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      title,
      content,
      date: new Date().toISOString()
    }

    if (directoryHandle) {
      try {
        const fileHandle = await directoryHandle.getFileHandle(`${newEntry.id}.json`, {
          create: true,
        })
        const writable = await fileHandle.createWritable()
        await writable.write(JSON.stringify(newEntry, null, 2))
        await writable.close()
        setEntries(prev => [newEntry, ...prev])
      } catch (error) {
        console.error('Error saving entry:', error)
      }
    } else {
      setEntries(prev => [newEntry, ...prev])
      localStorage.setItem(
        "journalEntries",
        JSON.stringify([newEntry, ...entries])
      )
    }
  }

  const deleteEntry = async (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)

    if (directoryHandle) {
      try {
        await directoryHandle.removeEntry(`${id}.json`)
      } catch (error) {
        console.error("Error deleting file:", error)
        localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))
      }
    } else {
      localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))
    }
  }

  return { entries, addEntry, deleteEntry, selectDirectory, isUsingFileSystem: !!directoryHandle }
}

