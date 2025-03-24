// src/speech-recognition.d.ts
interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
  
  interface SpeechRecognition extends EventTarget {
    new (): SpeechRecognition;
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    abort(): void;
    start(): void;
    stop(): void;
    onstart: (() => void) | null;
    onend: (() => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
  }