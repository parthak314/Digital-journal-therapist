import * as React from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceInputButton({ onTranscript }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = React.useState(false)
  const [error, setError] = React.useState<string>("")
  const recognitionRef = React.useRef<any>(null)

  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.")
      return
    }

    recognitionRef.current = new SpeechRecognition()
    const recognition = recognitionRef.current

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError("") // Clear any previous errors
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event)
      setError("Error occurred in recognition: " + event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join(" ")

      onTranscript(transcript)
    }

    return () => {
      recognition.stop()
    }
  }, [onTranscript])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error("Failed to start recognition:", err)
        setError("Failed to start speech recognition")
      }
    }
  }

  return (
    <Button
      variant={isListening ? "destructive" : "outline"}
      onClick={toggleListening}
      title={isListening ? "Stop recording" : "Start voice input"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  )
} 