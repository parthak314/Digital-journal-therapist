import * as React from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { JournalEntry } from "@/lib/use-journal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SearchDialogProps {
  entries: JournalEntry[]
  onSelect: (entry: JournalEntry) => void
}

export function SearchDialog({ entries, onSelect }: SearchDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [searchType, setSearchType] = React.useState<"exact" | "semantic">("exact")

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleExactSearch = (value: string) => {
    if (!value) {
      setSearchResults([])
      return
    }

    const results = entries.filter((entry) => {
      const content = entry.content.toLowerCase()
      const search = value.toLowerCase()
      return content.includes(search)
    })

    setSearchResults(results)
  }

  const handleSemanticSearch = async (value: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/semantic-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: value,
          entries: entries,
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setSearchResults(data.results);
    } catch (error) {
      console.error('Error in semantic search:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = async (value: string) => {
    setSearchTerm(value)
    if (searchType === "exact") {
      handleExactSearch(value)
    } else {
      await handleSemanticSearch(value)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search journal entries...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">Ctrl K</span>
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Tabs defaultValue="exact" className="w-full" onValueChange={(value) => setSearchType(value as "exact" | "semantic")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exact">Exact Match</TabsTrigger>
            <TabsTrigger value="semantic">Semantic Search (AI)</TabsTrigger>
          </TabsList>
        </Tabs>
        <CommandInput
          placeholder={searchType === "exact" ? "Search exact words or phrases..." : "Describe what you're looking for..."}
          value={searchTerm}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? "Searching..." : "No results found."}
          </CommandEmpty>
          <CommandGroup heading="Results">
            {searchResults.map((entry) => (
              <CommandItem
                key={entry.id}
                onSelect={() => {
                  onSelect(entry)
                  setOpen(false)
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{formatDate(entry.date)}</span>
                  <span className="text-sm text-muted-foreground line-clamp-1">
                    {entry.content}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
} 